import path from "path";
import fs from "fs";
import color from 'picocolors';
import { makeXML, Matching, } from "../../manifest";
import { OsStuff } from "../../utils/utils-os";
import { ensureNameUnique, nowDayTime, } from "../../utils/unique-names";
import { FileMeta, SameDc, RootGroup, TargetGroup } from "../app-types";
import { notes } from "../app-notes";
import { splitByKey } from "../../utils/utils";
import { addError, flatDcActive, step1_LoadManifests } from "../task-common";
import { appOptions } from "../app-arguments";
import { filterFilesByDomain } from "../../utils/utils-mani-urls";
import { step3_4_FinalMakeReport, step4_FinalMakeReportToAllGroups } from "./step-make-report";

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

function step3_1_MakeBackupCopy(targetGroup: TargetGroup): void {

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

function step3_2_Modify(targetGroup: TargetGroup): void {

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

function step3_3_Save(targetGroup: TargetGroup): void {

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

/*export*/ function step3_SaveResult(targetGroup: TargetGroup): void {
    if (targetGroup.sameDc.length) {
        try {
            targetGroup.backup = ensureNameUnique(`${targetGroup.root}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            if (appOptions.needBackup) {
                step3_1_MakeBackupCopy(targetGroup);
            }

            if (!appOptions.needUpdate) {
                step3_2_Modify(targetGroup);
                step3_3_Save(targetGroup);
            }

            if (!appOptions.needReport) {
                step3_4_FinalMakeReport(targetGroup);
            }
        } catch (error) {
        }
    }
}

function processRootGroup(rootGroup: RootGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);

    notes.addProcessed(`Source "${rootGroup.root}" has been processed.`);

    return targetGroup;
}

export function executeTaskDc(rootGroups: RootGroup[]) {
    const targetGroups = rootGroups.map(processRootGroup);

    if (!appOptions.needReport) {
        //TODO:
    }

    step4_FinalMakeReportToAllGroups(targetGroups);

    notes.add(`All done`);
}
