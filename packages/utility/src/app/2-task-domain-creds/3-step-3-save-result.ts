import { type SingleFolder } from "../9-types";
import { ensureNameUnique, nowDayTime } from "../../utils";
import { appOptions } from "../8-app-env";
import { step3_1_MakeBackupCopy, step3_2_Modify, step3_3_Save } from "./4-step-3-1-make-changes";
import { step3_4_MakeTargetGroupReport } from "./5-step-3-4-make-report-target";

/* Step 3 */

export function step3_SaveResult(singleFolder: SingleFolder): void {
    if (singleFolder.sameDomaincreds.length) {
        try {
            singleFolder.backupFolder = ensureNameUnique(`${singleFolder.rootFolder}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            if (appOptions.needBackup) {
                step3_1_MakeBackupCopy(singleFolder);
            }

            if (appOptions.needUpdate) {
                step3_2_Modify(singleFolder);
                step3_3_Save(singleFolder);
            }

            if (appOptions.needReport && appOptions.needBackup) { //TODO: appOptions.needBackup check is here to make sure folder for report exist
                step3_4_MakeTargetGroupReport(singleFolder);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
