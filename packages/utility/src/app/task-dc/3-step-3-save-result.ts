import { type TargetGroup } from "../9-types";
import { ensureNameUnique, nowDayTime } from "../../utils";
import { appOptions } from "../app-env";
import { step3_1_MakeBackupCopy, step3_2_Modify, step3_3_Save } from "./4-step-3-1-make-changes";
import { step3_4_MakeTargetGroupReport } from "./5-step-3-4-make-report-target";

/* Step 3 */

export function step3_SaveResult(targetGroup: TargetGroup): void {
    if (targetGroup.sameDc.length) {
        try {
            targetGroup.backup = ensureNameUnique(`${targetGroup.root}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            if (appOptions.needBackup) {
                step3_1_MakeBackupCopy(targetGroup);
            }

            if (appOptions.needUpdate) {
                step3_2_Modify(targetGroup);
                step3_3_Save(targetGroup);
            }

            if (appOptions.needReport && appOptions.needBackup) { //TODO: appOptions.needBackup check is here to make sure folder for report exist
                step3_4_MakeTargetGroupReport(targetGroup);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
