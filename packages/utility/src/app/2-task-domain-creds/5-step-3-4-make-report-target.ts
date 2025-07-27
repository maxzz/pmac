import path from "path";
import fs from "fs";
import { toUnix } from "../../utils";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type SingleFolder } from "../9-types";
import { numberOfDomCreds, templateStr } from "../4-common-tasks";

/* Step 3 */

export function step3_4_MakeSingleFolderReport(singleFolder: SingleFolder): void {
    if (numberOfDomCreds(singleFolder)) {
        const report = singleFolderToReport(singleFolder);
        writeToFile(report, singleFolder.backupFolder);
    }
}

function writeToFile(report: ReportFileFormat, backupFolder: string) {
    const reportStr = JSON.stringify([report], null, 4);

    const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);

    const fname = path.join(backupFolder, 'report.html');

    fs.writeFileSync(fname, cnt);
}

export function singleFolderToReport(singleFolder: SingleFolder): ReportFileFormat {
    return {
        ...singleFolder.report,
        root: toUnix(singleFolder.rootFolder),
    };
}
