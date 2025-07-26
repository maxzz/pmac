import path from "path";
import fs from "fs";
import { toUnix } from "../../utils";
import { type ReportFileFormat } from "@pmac/shared-types";
import { type SingleFolder } from "../9-types";
import { numberOfDomCreds, templateStr } from "../4-common-tasks";

/* Step 3 */

export function step3_4_MakeSingleFolderReport(singleFolder: SingleFolder): void {
    if (numberOfDomCreds(singleFolder)) {
        const reportStr = JSON.stringify([singleFolderToReport(singleFolder)], null, 4);
        const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);

        const fname = path.join(singleFolder.backupFolder, 'report.html');
        
        fs.writeFileSync(fname, cnt);
    }
}

export function singleFolderToReport(singleFolder: SingleFolder): ReportFileFormat {
    return {
        ...singleFolder.report,
        root: toUnix(singleFolder.rootFolder),
    };
}
