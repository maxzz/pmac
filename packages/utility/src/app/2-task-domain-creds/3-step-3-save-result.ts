import { type SingleFolder } from "../9-types";
import { ensureNameUnique, nowDayTime } from "../../utils";
import { appOptions } from "../8-app-env";
import { step3_1_MakeFilesBackupCopy } from "./4-step-3-1-make-changes";
import { step3_2_Modify } from "./4-step-3-2-modify";
import { step3_3_Save } from "./4-step-3-3-save";
import { step3_4_MakeSingleFolderReport } from "./5-step-3-4-make-report-report";

/* Step 3 */

export function step3_SaveResult(singleFolder: SingleFolder): void {
    if (!singleFolder.duplFileCnts.length) {
        return;
    }

    try {
        singleFolder.backupFolder = ensureNameUnique(`${singleFolder.rootFolder}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

        if (appOptions.needBackup) {
            step3_1_MakeFilesBackupCopy(singleFolder);
        }

        if (appOptions.needUpdate) {
            step3_2_Modify(singleFolder);
            step3_3_Save(singleFolder);
        }

        if (appOptions.needReport && appOptions.needBackup) { //TODO: appOptions.needBackup check is here to make sure folder for report exist
            step3_4_MakeSingleFolderReport(singleFolder);
        }
    } catch (error) {
        console.error(error);
    }
}
