import { FileMeta, SameDc, RootGroup, TargetGroup, AppOptions } from "../../app-types";
import { color, ensureNameUnique, filterFilesByDomain, nowDayTime, splitByKey } from "../../utils";
import { Matching } from "../../manifest";
import { appOptions, notes } from "../app-env";
import { addNoteIfEmptyAfterFilter, step1_LoadManifests } from "../task-common";
import { step3_1_MakeBackupCopy, step3_2_Modify, step3_3_Save } from "./step-make-changes";
import { step3_4_MakeTargetGroupReport, step4_MakeReportToAllGroups } from "./step-make-report";
import { numberOfDomCreds } from "../../utils/utils-app-report-template";

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
                step3_2_Modify(targetGroup);
                step3_3_Save(targetGroup);
            }

            if (appOptions.needReport && appOptions.needBackup) { //TODO: appOptions.needBackup check is here to make sure folder for report exist
                step3_4_MakeTargetGroupReport(targetGroup);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function processRootGroup(rootGroup: RootGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(rootGroup);
    const filteredOut = filterFilesByDomain(targetGroup.files, appOptions.domain);

    addNoteIfEmptyAfterFilter(targetGroup, filteredOut, appOptions);

    targetGroup.files = filteredOut;

    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);

    notes.addProcessed(`Source "${targetGroup.root}" has been processed. Updated manifests: ${numberOfDomCreds(targetGroup)}`);

    return targetGroup;
}

export function executeTaskDc(rootGroups: RootGroup[]) {
    const targetGroups = rootGroups.map(processRootGroup);
    step4_MakeReportToAllGroups(targetGroups);
    notes.addProcessed(color.green('All done'));
}
