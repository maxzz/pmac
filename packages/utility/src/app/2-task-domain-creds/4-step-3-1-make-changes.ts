import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { type FileCnt, type SingleFolder } from "../9-types";
import { type FileMani, type Mani, convertToXmlString, toManiFileFormat } from "../../manifest";
import { addError, flatDomainCredsActive, updateToRegexUrlsArray } from "../4-common-tasks";


export function step3_1_MakeBackupCopy(singleFolder: SingleFolder): void {
    try {
        const fileCnts: FileCnt[] = flatDomainCredsActive(singleFolder.sameDomaincreds);
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
            (f) => {
                const fname = path.join(destFolder, f.relativeFname);
                const maybeSubFolder = path.dirname(fname);
                OsStuff.mkdirSync(maybeSubFolder);
                fs.writeFileSync(fname, f.rawFileContent);
            }
        );
    }
}

export function step3_2_Modify(singleFolder: SingleFolder): void {
    singleFolder.report.domcreds = {
        multiple: flatDomainCredsActive(singleFolder.sameDomaincreds).map(
            (fileMeta) => {
                const newUrls = updateToRegexUrlsArray(fileMeta);
                fileMeta.mani?.forms?.forEach(
                    (form: Mani.Form, idx: number) => {
                        newUrls[idx] && (form.detection.web_murl = newUrls[idx]);
                    }
                );
                return {
                    id: fileMeta.id, //TODO: add more to report
                    urls: newUrls,
                };
            }
        ),
    };
}

export function step3_3_Save(singleFolder: SingleFolder): void {
    const fileCnts: FileCnt[] = flatDomainCredsActive(singleFolder.sameDomaincreds);
    fileCnts.forEach(
        (fileMeta) => {
            const xml = makeXML(fileMeta.mani);
            if (xml) {
                const newFname = path.join(singleFolder.rootFolder, fileMeta.relativeFname);
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
