import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";

function processRootGroup(rootGroup: RootGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    return targetGroup;
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    throw new Error('Not implemented yet');
    
    const targetGroups = rootGroups.map(processRootGroup);
    notes.add(`All done`);
}
