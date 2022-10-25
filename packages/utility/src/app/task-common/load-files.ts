import fs from "fs";
import path from "path";
import { RootGroup, TargetGroup } from "../app-types";
import { buildManiMetaForms, parseXMLFile } from "../../manifest";
import { getFormUrlsArray, reportFormUrlsArray } from "../../utils/utils-mani-urls";
import { programVersion } from "../app-help";
import { toUnix } from "../../utils/unique-names";
import { uuid } from "../../utils/uuid";

function loadManifests(rootGroup: RootGroup): TargetGroup {
    const rv: TargetGroup = {
        root: rootGroup.root,
        files: [],
        empty: [],
        failed: [],
        backup: path.join(rootGroup.root, 'temp'),  // later it will be replaced by a more suitable one
        sameDc: [],
        report: { root: '', version: programVersion, date: Date.now()},
    };

    for (const file of rootGroup.fnames) {
        const fname = path.join(rootGroup.root, file);
        try {
            const cnt = fs.readFileSync(fname).toString();
            const { mani } = parseXMLFile(cnt);
            const forms = buildManiMetaForms(mani);

            if (mani && forms.length) {
                rv.files.push({
                    id: uuid(),
                    mani,
                    forms,
                    urls: getFormUrlsArray(forms),
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

export function step1_LoadManifests(rootGroup: RootGroup): TargetGroup {
    const targetGroup = loadManifests(rootGroup); //printLoaded(targetGroup);

    targetGroup.report.inputs = {
        input: targetGroup.files.map((fileMeta, idx) => {
            return {
                id: fileMeta.id,
                idx,
                urls: reportFormUrlsArray(fileMeta),
                title: fileMeta.forms[0]?.mani?.options?.choosename || '',
                short: toUnix(fileMeta.short),
            };
        }),
    };

    return targetGroup;
}
