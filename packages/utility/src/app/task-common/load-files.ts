import fs from "fs";
import path from "path";
import { FileMeta, SourceGroup, TargetGroup } from "../app-types";
import { buildManiMetaForms, parseXMLFile } from "../../manifest";
import { getFormUrls } from "../../utils/utils-mani-urls";
import { programVersion } from "../app-help";
import { toUnix } from "../../utils/unique-names";
import { ReportFormUrls } from "@pmac/shared-types";
import { uuid } from "../../utils/uuid";

function loadManifests(sourceGroup: SourceGroup): TargetGroup {
    const rv: TargetGroup = {
        root: sourceGroup.root,
        files: [],
        empty: [],
        failed: [],
        backup: path.join(sourceGroup.root, 'temp'),  // later it will be replaced by a more suitable one
        sameDc: [],
        report: { root: '', version: programVersion, date: Date.now()},
    };

    for (const file of sourceGroup.fnames) {
        const fname = path.join(sourceGroup.root, file);
        try {
            const cnt = fs.readFileSync(fname).toString();
            const { mani } = parseXMLFile(cnt);
            const forms = buildManiMetaForms(mani);

            if (mani && forms.length) {
                rv.files.push({
                    id: uuid(),
                    mani,
                    forms,
                    urls: [getFormUrls(forms[0]), getFormUrls(forms[1])],
                    raw: cnt,
                    short: file,
                });
            } else {
                rv.empty.push(fname);
            }
        } catch (error) {
            rv.failed.push(fname);
        }
    }

    return rv;
}

function formUrls(f: FileMeta, idx: number): ReportFormUrls | undefined {
    const parts = f.urls[idx];
    const oWoP = parts?.o?.toLowerCase() === parts?.oParts?.woParms?.toLowerCase() ? undefined : parts?.oParts?.woParms;
    // if (oWoP) {
    //     console.log(`${color.green('ourl')} ${parts?.o}`);
    //     console.log(`${color.gray('oWoP')} ${oWoP}`);
    // }
    return parts?.o ? {
        domain: parts?.oParts?.domain,
        ourl: parts?.o,
        ...(oWoP && { oWoP }),
        ...(parts?.o !== parts?.m && { murl: parts?.m }),
    } : undefined;
}

export function step1_LoadManifests(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = loadManifests(sourceGroup);
    //printLoaded(targetGroup);

    targetGroup.report.inputs = {
        input: targetGroup.files.map((f, idx) => {
            const urls = [formUrls(f, 0), formUrls(f, 1)].filter(Boolean);
            return {
                id: f.id,
                idx,
                urls,
                title: f.forms[0]?.mani?.options?.choosename || '',
                short: toUnix(f.short),
            };
        }),
    };

    return targetGroup;
}
