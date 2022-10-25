import path from "path";
import fs from "fs";
import color from 'picocolors';
import { makeXML, Matching, } from "../../manifest";
import { OsStuff } from "../../utils/utils-os";
import { ensureNameUnique, nowDayTime, toUnix } from "../../utils/unique-names";
import { ItemError, ReportFormUrls, Report, ReportRecords } from "@pmac/shared-types";
import { FileMeta, SameDc, SourceGroup, TargetGroup } from "../app-types";
import { notes } from "../app-notes";
import { templateStr } from "../../utils/utils-report-template";
import { splitByKey } from "../../utils/utils";
import { addError, flatDcActive, step1_LoadManifests } from "../task-common";
import { appOptions } from "../app-arguments";

/*export*/ function step2_FindSameDc(targetGroup: TargetGroup) {
    function getSameDc(files: FileMeta[]): SameDc[] {
        const byDomains = splitByKey(files, (fileMeta) => {
            const loginForm = fileMeta.urls?.[0];
            const loginStyle = loginForm?.mData?.style;
            const makeSenseToProcces = loginStyle === Matching.Style.undef || loginStyle === Matching.Style.makeDomainMatch;
            return makeSenseToProcces ? loginForm?.oParts?.domain : undefined;
        });

        const haveSameDc = Object.entries(byDomains).filter(([domain, files]) => files.length > 1);

        const sameDC = haveSameDc.map(([domain, files]) => ({ domain, files }));
        return sameDC;
    }

    targetGroup.sameDc = getSameDc(targetGroup.files);
}

function final1_MakeBackupCopy(targetGroup: TargetGroup): void {

    function makeBackupCopy(files: FileMeta[], destFolder: string): void {
        OsStuff.mkdirSync(destFolder);
        files.forEach((f) => {
            const fname = path.join(destFolder, f.short);
            const maybeSubFolder = path.dirname(fname);
            OsStuff.mkdirSync(maybeSubFolder);
            fs.writeFileSync(fname, f.raw);
        });
    }

    try {
        const sameDC: FileMeta[] = flatDcActive(targetGroup.sameDc);
        makeBackupCopy(sameDC, targetGroup.backup);
    } catch (error) {
        addError(targetGroup, {
            text: `Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${targetGroup.root}`,
            isError: true,
        });
        throw error;
    }
}

function final2_Modify(targetGroup: TargetGroup): void {

    function modifyUrl(url: string | undefined): string | undefined {
        return url && Matching.makeRawMatchData({ style: Matching.Style.regex, opt: Matching.Options.pmacSet, url }, '');
    }

    targetGroup.report.domcreds = {
        multiple: flatDcActive(targetGroup.sameDc).map((file) => {
            const newUrls = [
                modifyUrl(file.urls?.[0].m),
                modifyUrl(file.urls?.[1].m),
            ].filter(Boolean);
            return {
                id: file.id, //TODO: add more to report
                urls: newUrls,
            };
        }),
    };
}

function final3_Save(targetGroup: TargetGroup): void {

    //was: (duplicates: Duplicate[])

    // const destFolder = ensureNameUnique(`${targetGroup.root}/new ${nowDayTime()}`, false);
    // osStuff.mkdirSync(destFolder);

    const destFolder = targetGroup.root;

    flatDcActive(targetGroup.sameDc).forEach((f) => {

        const xml = makeXML(f.mani);
        if (xml) {
            const newFname = path.join(destFolder, f.short);
            fs.writeFileSync(newFname, xml);


            //const newDir = path.join(f.short, 'new');
            //const newFname = path.join(newDir, f.short);
            // const newFname = path.join(newDir, path.basename(f.short, path.extname(f.fname)) + '_new') + path.extname(f.fname);
            //osStuff.mkdirSync(newDir);
            //fs.writeFileSync(newFname, xml);
        }
    });

    //TODO: place modified files into original folder

}

function final4_FinalMakeReport(targetGroup: TargetGroup): void {

    function makeHtmlReport(targetGroup: TargetGroup): string | undefined {
        if (Object.keys(targetGroup.report).length) {
            const dataStr = JSON.stringify(targetGroup.report, null, 4);

            console.log('dataStr:\n', dataStr); // to debug template project

            return templateStr.replace('"__INJECTED__DATA__"', dataStr);
        }
    }

    const report: ReportRecords = [{ ...targetGroup.report, root: toUnix(targetGroup.root) }];
    const reportStr = JSON.stringify(report, null, 4);
    console.log('dataStr:\n', reportStr);

    const fname = path.join(targetGroup.backup, 'report.html');
    const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);
    fs.writeFileSync(fname, cnt);
}

/*export*/ function step3_SaveResult(targetGroup: TargetGroup): void {
    if (targetGroup.sameDc.length) {
        try {
            targetGroup.backup = ensureNameUnique(`${targetGroup.root}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            final1_MakeBackupCopy(targetGroup);
            final2_Modify(targetGroup);
            // final3_Save(targetGroup);
            final4_FinalMakeReport(targetGroup);
        } catch (error) {
        }
    }
}

/*export*/ function step4_FinalMakeReport(targetGroups: TargetGroup[]): void {

    const report: ReportRecords = targetGroups.map((targetGroup) => ({ ...targetGroup.report, root: toUnix(targetGroup.root) }));
    const dataStr = JSON.stringify(report, null, 4);
    console.log('dataStr:\n', dataStr);
    templateStr.replace('"__INJECTED__DATA__"', dataStr);

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

    notes.add(`All done`);
}

function processSourceGroup(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(sourceGroup);

    if (appOptions.domain) {
        //TODO: filter targetGroup.files        
    }

    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);
    return targetGroup;
}

export function executeTaskDc(sourceGroups: SourceGroup[]) {
    const targetGroups = sourceGroups.map(processSourceGroup);

    if (!appOptions.noReport) {
        //TODO:
    }
    
    if (!appOptions.noBackup) {
        //TODO:
    }

    if (!appOptions.noUpdate) {
        //TODO:
    }

    //step4_FinalMakeReport(targetGroups);
}
