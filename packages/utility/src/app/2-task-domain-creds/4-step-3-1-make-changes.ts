import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { type FileMeta, type TargetGroup } from "../9-types";
import { type FileMani, type Mani, convertToXmlString, toManiFileFormat } from "../../manifest";
import { addError, flatDomainCredsActive } from "../4-common-tasks";
import { updateToRegexUrlsArray } from "../../utils/1-app-utils-app-mani-urls";

export function step3_1_MakeBackupCopy(targetGroup: TargetGroup): void {
    try {
        const files: FileMeta[] = flatDomainCredsActive(targetGroup.sameDomaincreds);
        makeBackupCopy(files, targetGroup.backup);
    } catch (error) {
        addError(targetGroup, {
            text: `Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${targetGroup.root}`,
            isError: true,
        });
        throw error;
    }

    function makeBackupCopy(files: FileMeta[], destFolder: string): void {
        OsStuff.mkdirSync(destFolder);
        files.forEach(
            (f) => {
                const fname = path.join(destFolder, f.short);
                const maybeSubFolder = path.dirname(fname);
                OsStuff.mkdirSync(maybeSubFolder);
                fs.writeFileSync(fname, f.raw);
            }
        );
    }
}

export function step3_2_Modify(targetGroup: TargetGroup): void {
    targetGroup.report.domcreds = {
        multiple: flatDomainCredsActive(targetGroup.sameDomaincreds).map(
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

export function step3_3_Save(targetGroup: TargetGroup): void {
    const files: FileMeta[] = flatDomainCredsActive(targetGroup.sameDomaincreds);
    files.forEach(
        (fileMeta) => {
            const xml = makeXML(fileMeta.mani);
            if (xml) {
                const newFname = path.join(targetGroup.root, fileMeta.short);
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
