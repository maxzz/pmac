import { type RootGroup, type SingleFolder } from "../9-types";
import { color} from "../../utils";
import { appOptions, Notes } from "../8-app-env";
import { addNoteIfEmptyAfterFilter, filterFilesByDomain, step1_LoadManifests } from "../4-common-tasks";
import { step2_FindSameDomainCreds } from "./2-step-2-find-same-domain-creds";
import { step3_SaveResult } from "./3-step-3-save-result";
import { step4_MakeReportToAllGroups } from "./6-step-4-make-report-all";
import { numberOfDomCreds } from "../4-common-tasks";

export function executeTaskDc(rootGroups: RootGroup[]) {
    const targetGroups = rootGroups.map(processSingleFolderRoot);

    step4_MakeReportToAllGroups(targetGroups);
    
    Notes.addProcessed(color.green('All done'));
}

function processSingleFolderRoot(rootGroup: RootGroup): SingleFolder {
    const singleFolder = step1_LoadManifests(rootGroup);
    const filesByDomain = filterFilesByDomain(singleFolder.files, appOptions.domain);

    const gotEmptySet = !filesByDomain.length && singleFolder.files.length && appOptions.domain;
    singleFolder.files = filesByDomain;

    step2_FindSameDomainCreds(singleFolder);
    step3_SaveResult(singleFolder);

    Notes.addProcessed(`Source "${singleFolder.rootFolder}" has been processed. Updated manifests: ${numberOfDomCreds(singleFolder)}`);
    gotEmptySet && addNoteIfEmptyAfterFilter('       ', appOptions);

    return singleFolder;
}
