import path from "path";
import fs from "fs";
import { programVersion } from "../8-app-env";
import { toUnix } from "../../utils";
import { type RootGroup, type SingleFolder } from "../9-types";
import { buildManiMetaForms, parseXMLFile, uuid } from "../../manifest";
import { getFormUrls, reportFormUrlsArray } from "./1-app-utils-app-mani-urls";

/* Step 1 */

export function step1_LoadManifests(rootGroup: RootGroup): SingleFolder {
    const singleFolder = loadManifests(rootGroup); //printLoaded(targetGroup);

    singleFolder.report.inputs = { // fill out directory of all loaded files for report refs
        input: singleFolder.fileCnts.map(
            (fileCnt, idx) => {
                return {
                    id: fileCnt.id,
                    idx,
                    urls: reportFormUrlsArray(fileCnt),
                    title: fileCnt.metaForms[0]?.mani?.options?.choosename || '',
                    short: toUnix(fileCnt.relativeFname),
                };
            }
        ),
    };

    return singleFolder;
}

function loadManifests(rootGroup: RootGroup): SingleFolder {
    const rv: SingleFolder = {
        rootFolder: rootGroup.root,
        fileCnts: [],
        fnamesEmpty: [],
        fnamesFailed: [],
        backupFolder: path.join(rootGroup.root, 'temp'),  // later it will be replaced by a more suitable one
        duplFileCnts: [],
        report: { root: '', version: programVersion, date: Date.now() },
    };

    for (const relativeFname of rootGroup.fnames) {
        const fname = path.join(rootGroup.root, relativeFname);
        try {
            const rawFileContent = fs.readFileSync(fname).toString();
            const { mani } = parseXMLFile(rawFileContent);
            const forms = buildManiMetaForms(mani?.forms);
            const metaForms = forms.map(form => ({ ...form, urls: getFormUrls(form) }));

            if (mani && forms.length) {
                rv.fileCnts.push({
                    id: uuid(),
                    mani,
                    metaForms: metaForms,
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
