import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";

function processRootGroup(rootGroup: RootGroup) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    targetGroup.files.forEach((fileMeta) => {
        console.log('    ', fileMeta.short);
    });

}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    //throw new Error('Not implemented yet');

    rootGroups.forEach(processRootGroup);
    notes.add(`All done`);
}
