import { type RootGroup, type TargetGroup } from "../9-types";
import { color, filterFilesByDomain } from "../../utils";
import { appOptions, Notes } from "../app-env";
import { addNoteIfEmptyAfterFilter, step1_LoadManifests } from "../task-common";
import { step2_FindSameDomainCreds } from "./2-step-2-find-smae-domain-creds";
import { step3_SaveResult } from "./3-step-3-save-result";
import { step4_MakeReportToAllGroups } from "./6-step-4-make-report-all";
import { numberOfDomCreds } from "../../utils/1-app-utils-app-report-template";

export function executeTaskDc(rootGroups: RootGroup[]) {
    const targetGroups = rootGroups.map(processRootGroup);

    step4_MakeReportToAllGroups(targetGroups);
    
    Notes.addProcessed(color.green('All done'));
}

function processRootGroup(rootGroup: RootGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(rootGroup);
    const filteredOut = filterFilesByDomain(targetGroup.files, appOptions.domain);

    const gotEmptySet = !filteredOut.length && targetGroup.files.length && appOptions.domain;
    targetGroup.files = filteredOut;

    step2_FindSameDomainCreds(targetGroup);
    step3_SaveResult(targetGroup);

    Notes.addProcessed(`Source "${targetGroup.root}" has been processed. Updated manifests: ${numberOfDomCreds(targetGroup)}`);
    gotEmptySet && addNoteIfEmptyAfterFilter('       ', appOptions);

    return targetGroup;
}
