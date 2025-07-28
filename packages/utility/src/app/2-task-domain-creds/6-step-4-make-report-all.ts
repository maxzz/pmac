import path from "path";
import fs from "fs";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type SingleFolder } from "../9-types";
import { appOptions } from "../8-app-env";
import { singleFolderToReport } from "./5-step-3-4-make-report-report";

/* Step 4 */

export function step4_MakeReportToAllSingleFolders(singleFolders: SingleFolder[]): void {
    if (!appOptions.generateJson) {
        return;
    }

    createJsonForDebugging(singleFolders);
}

/**
 * This combined report is for debugging multiple targets, the html file has a single report.
 */
function createJsonForDebugging(singleFolders: SingleFolder[]): void {
    const scriptFilename = process.argv[1];
    const jsonFilePath = path.resolve(scriptFilename, testDataPath);
    
    if (!isRunningDebug(scriptFilename, jsonFilePath)) {
        return;
    }

    const jsonFilename = path.join(jsonFilePath, 'test-data-private.json');
    const reportStr = JSON.stringify(singleFolders.map<ReportFileFormat>(singleFolderToReport), null, 4);

    fs.writeFileSync(jsonFilename, reportStr); //console.log(`generateJson:\n${color.blue(jsonFilename)}\n${reportStr}`);
}

function isRunningDebug(scriptFilename: string, jsonFilePath: string): boolean | null {
    const rv = scriptFilename.match(/pmac\\packages\\utility\\dist\\index.js$/) && fs.existsSync(jsonFilePath);
    return rv;
}

const testDataPath = "../../../template/src/test-data/"; // "packages/template/src/test-data/test-data-private.json"
