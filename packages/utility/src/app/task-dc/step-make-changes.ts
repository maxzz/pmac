import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { FileMeta, TargetGroup } from "../../app-types";
import { addError, flatDcActive } from "../task-common";
import { makeXML, Mani, Matching } from "../../manifest";
import { updateToRegexUrlsArray } from "../../utils/utils-app-mani-urls";

export function step3_1_MakeBackupCopy(targetGroup: TargetGroup): void {

    function makeBackupCopy(files: FileMeta[], destFolder: string): void {
        OsStuff.mkdirSync(destFolder);
        files.forEach((f) => {
            const fname = path.join(destFolder, f.short);
            const maybeSubFolder = path.dirname(fname);
            OsStuff.mkdirSync(maybeSubFolder);
            fs.writeFileSync(fname, f.raw);
        });
    }

    try {
        const files: FileMeta[] = flatDcActive(targetGroup.sameDc);
        makeBackupCopy(files, targetGroup.backup);
    } catch (error) {
        addError(targetGroup, {
            text: `Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${targetGroup.root}`,
            isError: true,
        });
        throw error;
    }
}

export function step3_2_Modify(targetGroup: TargetGroup): void {
    targetGroup.report.domcreds = {
        multiple: flatDcActive(targetGroup.sameDc).map((fileMeta) => {
            const newUrls = updateToRegexUrlsArray(fileMeta);
            fileMeta.mani?.forms?.forEach((form: Mani.Form, idx: number) => {
                newUrls[idx] && (form.detection.web_murl = newUrls[idx]);
            })
            return {
                id: fileMeta.id, //TODO: add more to report
                urls: newUrls,
            };
        }),
    };
}

export function step3_3_Save(targetGroup: TargetGroup): void {
    const files: FileMeta[] = flatDcActive(targetGroup.sameDc);
    files.forEach((fileMeta) => {
        const xml = makeXML(fileMeta.mani);
        if (xml) {
            const newFname = path.join(targetGroup.root, fileMeta.short);
            fs.writeFileSync(newFname, xml);
        }
    });
}
