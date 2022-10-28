import { FileMeta, SameDc, RootGroup, TargetGroup } from "../../app-types";
import { ensureNameUnique, filterFilesByDomain, nowDayTime, splitByKey } from "../../utils";
import { Matching } from "../../manifest";
import { appOptions, notes } from "../app-env";
import { step1_LoadManifests } from "../task-common";
import { step3_1_MakeBackupCopy, step3_2_ModifyOriginals4Repost, step3_3_Save } from "./step-make-changes";
import { step3_4_FinalMakeReport, step4_FinalMakeReportToAllGroups } from "./step-make-report";

function step2_FindSameDc(targetGroup: TargetGroup) {
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

function step3_SaveResult(targetGroup: TargetGroup): void {
    if (targetGroup.sameDc.length) {
        try {
            targetGroup.backup = ensureNameUnique(`${targetGroup.root}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            if (appOptions.needBackup) {
                step3_1_MakeBackupCopy(targetGroup);
            }

            if (appOptions.needUpdate) {
                step3_2_ModifyOriginals4Repost(targetGroup);
                step3_3_Save(targetGroup);
            }

            if (appOptions.needReport) {
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
