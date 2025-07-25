import path from "path";
import fs from "fs";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type TargetGroup } from "../../app-types";
import { appOptions } from "../app-env";
import { targetGroupToReport } from "./5-step-3-4-make-report-target";

/* Step 4 */

export function step4_MakeReportToAllGroups(targetGroups: TargetGroup[]): void {
    createJsonForDebugging(targetGroups);

    function createJsonForDebugging(targetGroups: TargetGroup[]) {
        // This combined report is for debugging multiple targets, the html file has a single report.

        if (appOptions.generateJson) {
            const scriptFilename = process.argv[1];

            const jsonFilePath = path.resolve(scriptFilename, '../../../template/src/utils/');
            const isRunningDebug = scriptFilename.match(/pmac\\packages\\utility\\dist\\index.js$/) && fs.existsSync(jsonFilePath);

            if (isRunningDebug) {
                const jsonFilename = path.join(jsonFilePath, 'test-data-private.json');
                const reportStr = JSON.stringify(targetGroups.map<ReportFileFormat>(targetGroupToReport), null, 4);

                fs.writeFileSync(jsonFilename, reportStr); //console.log(`generateJson:\n${color.blue(jsonFilename)}\n${reportStr}`);
            }
        }
    }
}
