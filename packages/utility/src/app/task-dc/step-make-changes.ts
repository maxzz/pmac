import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { FileMeta, TargetGroup } from "../../app-types";
import { addError, flatDcActive } from "../task-common";
import { makeXML, Matching } from "../../manifest";
import { modify4ReportUrlsArray } from "../../utils/utils-app-mani-urls";

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

export function step3_2_ModifyOriginals4Repost(targetGroup: TargetGroup): void {
    targetGroup.report.domcreds = {
        multiple: flatDcActive(targetGroup.sameDc).map((fileMeta) => {
            return {
                id: fileMeta.id, //TODO: add more to report
                urls: modify4ReportUrlsArray(fileMeta),
            };
        }),
    };
}

export function step3_3_Save(targetGroup: TargetGroup): void {

    //was: (duplicates: Duplicate[])

    // const destFolder = ensureNameUnique(`${targetGroup.root}/new ${nowDayTime()}`, false);
    // osStuff.mkdirSync(destFolder);

    const destFolder = targetGroup.root;

    const files: FileMeta[] = flatDcActive(targetGroup.sameDc);
    files.forEach((f) => {

        const xml = makeXML(f.mani);
        if (xml) {
            const newFname = path.join(destFolder, f.short);
            fs.writeFileSync(newFname, xml);


            //const newDir = path.join(f.short, 'new');
            //const newFname = path.join(newDir, f.short);
            // const newFname = path.join(newDir, path.basename(f.short, path.extname(f.fname)) + '_new') + path.extname(f.fname);
            //osStuff.mkdirSync(newDir);
            //fs.writeFileSync(newFname, xml);
        }
    });

    //TODO: place modified files into original folder

}
