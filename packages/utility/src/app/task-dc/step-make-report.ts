import path from "path";
import fs from "fs";
import { Report } from "@pmac/shared-types";
import { color, templateStr, toUnix } from "../../utils";
import { TargetGroup } from "../../app-types";
import { appOptions } from "../app-env";
import { numberOfDomCreds } from "../../utils/utils-app-report-template";

function targetGroupToReport(targetGroup: TargetGroup): Report {
    return { ...targetGroup.report, root: toUnix(targetGroup.root) };
}

function createJsonForDebugging(targetGroups: TargetGroup[]) {
    // This combined report is for debugging multiple targets, the html file has a single report.
    if (appOptions.generateJson) {
        const scriptFilename = process.argv[1];
        const jsonFilePath = path.resolve(scriptFilename, '../../../template/src/utils/');
        const isRunningDebug = scriptFilename.match(/pmac\\packages\\utility\\dist\\index.js$/) && fs.existsSync(jsonFilePath);
        if (isRunningDebug) {
            const jsonFilename = path.join(jsonFilePath, 'test-data-private.json');
            const reportStr = JSON.stringify(targetGroups.map<Report>(targetGroupToReport), null, 4);
            fs.writeFileSync(jsonFilename, reportStr); //console.log(`generateJson:\n${color.blue(jsonFilename)}\n${reportStr}`);
        }
    }
}

export function step3_4_MakeTargetGroupReport(targetGroup: TargetGroup): void {
    if (numberOfDomCreds(targetGroup)) {
        const reportStr = JSON.stringify([targetGroupToReport(targetGroup)], null, 4);
        const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);
        const fname = path.join(targetGroup.backup, 'report.html');
        fs.writeFileSync(fname, cnt);
    }
}

export function step4_MakeReportToAllGroups(targetGroups: TargetGroup[]): void {
    createJsonForDebugging(targetGroups);
}
