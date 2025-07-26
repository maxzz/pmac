import path from "path";
import fs from "fs";
import { programVersion } from "../8-app-env";
import { toUnix } from "../../utils";
import { type ItemInputFile } from "@pmac/shared-types";
import { type ArgsFolder, type SingleFolder } from "../9-types";
import { buildManiMetaForms, parseXMLFile, uuid } from "../../manifest";
import { getFormUrls, reportFormUrlsArray } from "./1-app-utils-app-mani-urls";

/* Step 1 */

export function step1_LoadManifests(argsFolder: ArgsFolder): SingleFolder {
    const singleFolder = loadManifests(argsFolder); //printLoaded(targetGroup);

    singleFolder.report.inputs = { 
        input: buildReportInputs(singleFolder),
    };

    return singleFolder;
}

function loadManifests(argsFolder: ArgsFolder): SingleFolder {
    const rv: SingleFolder = {
        rootFolder: argsFolder.rootFolder,
        fileCnts: [],
        fnamesEmpty: [],
        fnamesFailed: [],
        backupFolder: path.join(argsFolder.rootFolder, 'temp'),  // later it will be replaced by a more suitable one
        duplFileCnts: [],
        report: { root: '', version: programVersion, date: Date.now() },
    };

    for (const relativeFname of argsFolder.fnames) {
        const fname = path.join(argsFolder.rootFolder, relativeFname);
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

function buildReportInputs(singleFolder: SingleFolder): ItemInputFile[] {
    const rv = singleFolder.fileCnts.map( // fill out directory of all loaded files for report refs
        (fileCnt, idx) => {
            return {
                id: fileCnt.id,
                idx,
                urls: reportFormUrlsArray(fileCnt),
                title: fileCnt.metaForms[0]?.mani?.options?.choosename || '',
                short: toUnix(fileCnt.relativeFname),
            };
        }
    );
    return rv;
}
