import path from "path";
import fs from "fs";
import { programVersion } from "../8-app-env";
import { toUnix } from "../../utils";
import { type RootGroup, type SingleFolder } from "../9-types";
import { buildManiMetaForms, parseXMLFile, uuid } from "../../manifest";
import { getFormUrlsArray, reportFormUrlsArray } from "./1-app-utils-app-mani-urls";

/* Step 1 */

export function step1_LoadManifests(rootGroup: RootGroup): SingleFolder {
    const targetGroup = loadManifests(rootGroup); //printLoaded(targetGroup);

    targetGroup.report.inputs = { // fill out directory of all loaded files for report refs
        input: targetGroup.files.map((fileMeta, idx) => {
            return {
                id: fileMeta.id,
                idx,
                urls: reportFormUrlsArray(fileMeta),
                title: fileMeta.forms[0]?.mani?.options?.choosename || '',
                short: toUnix(fileMeta.relativeFname),
            };
        }),
    };

    return targetGroup;
}

function loadManifests(rootGroup: RootGroup): SingleFolder {
    const rv: SingleFolder = {
        rootFolder: rootGroup.root,
        files: [],
        fnamesEmpty: [],
        fnamesFailed: [],
        backupFolder: path.join(rootGroup.root, 'temp'),  // later it will be replaced by a more suitable one
        sameDomaincreds: [],
        report: { root: '', version: programVersion, date: Date.now()},
    };

    for (const relativeFname of rootGroup.fnames) {
        const fname = path.join(rootGroup.root, relativeFname);
        try {
            const rawFileContent = fs.readFileSync(fname).toString();
            const { mani } = parseXMLFile(rawFileContent);
            const forms = buildManiMetaForms(mani?.forms);

            if (mani && forms.length) {
                rv.files.push({
                    id: uuid(),
                    mani,
                    forms,
                    urls: getFormUrlsArray(forms),
                    rawFileContent,
                    relativeFname,
                });
            } else {
                rv.fnamesEmpty.push(fname);
            }
        } catch (error) {
            rv.fnamesFailed.push(fname);
        }
    }

    return rv;
}
