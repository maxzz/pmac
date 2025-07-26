import path from "path";
import fs from "fs";
import { templateStr, toUnix } from "../../utils";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type TargetGroup } from "../9-types";
import { numberOfDomCreds } from "../../utils/1-app-utils-app-report-template";

/* Step 3 */

export function step3_4_MakeTargetGroupReport(targetGroup: TargetGroup): void {
    if (numberOfDomCreds(targetGroup)) {
        const reportStr = JSON.stringify([targetGroupToReport(targetGroup)], null, 4);
        const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);
        const fname = path.join(targetGroup.backup, 'report.html');
        fs.writeFileSync(fname, cnt);
    }
}

export function targetGroupToReport(targetGroup: TargetGroup): ReportFileFormat {
    return {
        ...targetGroup.report,
        root: toUnix(targetGroup.root),
    };
}
