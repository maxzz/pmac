import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { type FileCnt, type SingleFolder } from "../9-types";
import { type FileMani, type Mani, convertToXmlString, toManiFileFormat } from "../../manifest";
import { addError, duplFileCntsToFileCnts, updateToRegexUrlsArray } from "../4-common-tasks";

export function step3_1_MakeBackupCopy(singleFolder: SingleFolder): void {
    try {
        const fileCnts: FileCnt[] = duplFileCntsToFileCnts(singleFolder.duplFileCnts);
        makeBackupCopy(fileCnts, singleFolder.backupFolder);
    } catch (error) {
        addError(singleFolder, {
            text: `Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${singleFolder.rootFolder}`,
            isError: true,
        });
        throw error;
    }

    function makeBackupCopy(fileCnts: FileCnt[], destFolder: string): void {
        OsStuff.mkdirSync(destFolder);
        fileCnts.forEach(
            (fileCnt) => {
                const fname = path.join(destFolder, fileCnt.relativeFname);
                const maybeSubFolder = path.dirname(fname);
                OsStuff.mkdirSync(maybeSubFolder);
                fs.writeFileSync(fname, fileCnt.rawFileContent);
            }
        );
    }
}

export function step3_2_Modify(singleFolder: SingleFolder): void {
    singleFolder.report.domcreds = {
        multiple: duplFileCntsToFileCnts(singleFolder.duplFileCnts).map(
            (fileCnt) => {
                const newUrls = updateToRegexUrlsArray(fileCnt);
                fileCnt.mani?.forms?.forEach(
                    (form: Mani.Form, idx: number) => {
                        newUrls[idx] && (form.detection.web_murl = newUrls[idx]);
                    }
                );
                return {
                    id: fileCnt.id, //TODO: add more to report
                    urls: newUrls,
                };
            }
        ),
    };
}

export function step3_3_Save(singleFolder: SingleFolder): void {
    const fileCnts: FileCnt[] = duplFileCntsToFileCnts(singleFolder.duplFileCnts);
    fileCnts.forEach(
        (fileCnt) => {
            const xml = makeXML(fileCnt.mani);
            if (xml) {
                const newFname = path.join(singleFolder.rootFolder, fileCnt.relativeFname);
                fs.writeFileSync(newFname, xml);
            }
        }
    );
}

function makeXML(newMani: Mani.Manifest): string | undefined {
    try {
        const root: FileMani.Manifest = toManiFileFormat(newMani);
        const res = convertToXmlString({ mani: root });

        const { xml, error } = res;
        if (error || !xml) {
            console.error('Error converting to xml', error);
            return;
        }
        return xml;
    } catch (error) {
        return undefined;
    }
}
