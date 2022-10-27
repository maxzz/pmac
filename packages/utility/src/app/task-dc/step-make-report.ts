import path from "path";
import fs from "fs";
import { ItemError, ReportFormUrls, Report, ReportRecords } from "@pmac/shared-types";
import { color, templateStr, toUnix } from "../../utils";
import { TargetGroup } from "../../app-types";

export function step3_4_FinalMakeReport(targetGroup: TargetGroup): void {

    function makeHtmlReport(targetGroup: TargetGroup): string | undefined {
        if (Object.keys(targetGroup.report).length) {
            const dataStr = JSON.stringify(targetGroup.report, null, 4);

            console.log('dataStr:\n', dataStr); // to debug template project

            return templateStr.replace('"__INJECTED__DATA__"', dataStr);
        }
    }

    const report: ReportRecords = [{ ...targetGroup.report, root: toUnix(targetGroup.root) }];
    const reportStr = JSON.stringify(report, null, 4);
    //console.log('dataStr:\n', reportStr);

    const fname = path.join(targetGroup.backup, 'report.html');
    const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);
    fs.writeFileSync(fname, cnt);
}

export function step4_FinalMakeReportToAllGroups(targetGroups: TargetGroup[]): void {

    /*
    const report: ReportRecords = targetGroups.map((targetGroup) => ({ ...targetGroup.report, root: toUnix(targetGroup.root) }));
    const dataStr = JSON.stringify(report, null, 4);
    
    console.log('dataStr:\n', dataStr);
    
    templateStr.replace('"__INJECTED__DATA__"', dataStr);
    */



    // function makeHtmlReport(targetGroup: TargetGroup): string | undefined {
    //     if (Object.keys(targetGroup.report).length) {
    //         const dataStr = JSON.stringify(targetGroup.report, null, 4);
    //         console.log('dataStr:\n', dataStr);
    //         return templateStr.replace('"__INJECTED__DATA__"', dataStr);
    //     }
    // }
    //
    // targetGroups.forEach((targetGroup) => {
    //     const report = makeHtmlReport(targetGroup);
    //
    //     if (targetGroup.sameDc.length) {
    //         printDcActive(targetGroup.sameDc);
    //     } else {
    //         notes.add(`\nNothing done:\nThere are no duplicates in ${targetGroup.files.length} loaded file${targetGroup.files.length === 1 ? '' : 's'}.`);
    //     }
    //
    //     if (report) {
    //         //TODO: save it into the same folder
    //         //console.log('newTemplate\n', report);
    //         console.log(color.gray(`newTemplate: ${report.substring(0, 100).replace(/\r?\n/g, ' ')}`));
    //     }
    //
    //     notes.add(`All done in folder ${targetGroup.root}`);
    // });
}
