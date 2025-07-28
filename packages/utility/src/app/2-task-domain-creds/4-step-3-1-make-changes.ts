import path from "path";
import fs from "fs";
import { OsStuff } from "../../utils";
import { type FileCnt, type SingleFolder } from "../9-types";
import { addError, duplFileCntsToFileCnts } from "../4-common-tasks";

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
