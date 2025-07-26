import path from "path";
import fs from "fs";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type SingleFolder } from "../9-types";
import { appOptions } from "../8-app-env";
import { targetGroupToReport } from "./5-step-3-4-make-report-target";

/* Step 4 */

export function step4_MakeReportToAllGroups(singleFolders: SingleFolder[]): void {
    createJsonForDebugging(singleFolders);
}

/**
 * This combined report is for debugging multiple targets, the html file has a single report.
 */
function createJsonForDebugging(singleFolders: SingleFolder[]): void {
    if (!appOptions.generateJson) {
        return;
    }

    const scriptFilename = process.argv[1];

    const jsonFilePath = path.resolve(scriptFilename, '../../../template/src/utils/');
    const isRunningDebug = scriptFilename.match(/pmac\\packages\\utility\\dist\\index.js$/) && fs.existsSync(jsonFilePath);

    if (isRunningDebug) {
        const jsonFilename = path.join(jsonFilePath, 'test-data-private.json');
        const reportStr = JSON.stringify(singleFolders.map<ReportFileFormat>(targetGroupToReport), null, 4);

        fs.writeFileSync(jsonFilename, reportStr); //console.log(`generateJson:\n${color.blue(jsonFilename)}\n${reportStr}`);
    }
}
