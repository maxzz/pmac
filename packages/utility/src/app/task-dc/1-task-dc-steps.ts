import { type RootGroup, type TargetGroup } from "../../app-types";
import { color, filterFilesByDomain } from "../../utils";
import { appOptions, notes } from "../app-env";
import { addNoteIfEmptyAfterFilter, step1_LoadManifests } from "../task-common";
import { step2_FindSameDc } from "./2-step-2-find-smae-dc";
import { step3_SaveResult } from "./3-step-3-save-result";
import { step4_MakeReportToAllGroups } from "./6-step-4-make-report-all";
import { numberOfDomCreds } from "../../utils/utils-app-report-template";

export function executeTaskDc(rootGroups: RootGroup[]) {
    const targetGroups = rootGroups.map(processRootGroup);
    step4_MakeReportToAllGroups(targetGroups);
    notes.addProcessed(color.green('All done'));
}

function processRootGroup(rootGroup: RootGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(rootGroup);
    const filteredOut = filterFilesByDomain(targetGroup.files, appOptions.domain);
    const gotEmptySet = !filteredOut.length && targetGroup.files.length && appOptions.domain;
    targetGroup.files = filteredOut;

    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);

    notes.addProcessed(`Source "${targetGroup.root}" has been processed. Updated manifests: ${numberOfDomCreds(targetGroup)}`);
    gotEmptySet && addNoteIfEmptyAfterFilter('       ', appOptions);

    return targetGroup;
}
