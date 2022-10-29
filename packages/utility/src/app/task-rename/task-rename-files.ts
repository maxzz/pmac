import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";

function processRootGroup(rootGroup: RootGroup) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    targetGroup.files.forEach((fileMeta) => {
        const filenameWPerix = fileMeta.short.match(/(.*)({c857ed8e-5e08-48c2-ac5e-be1495b7b5a3})(.*)\.dpm/);
        console.log('    ', fileMeta.short, filenameWPerix);
    });
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    //throw new Error('Not implemented yet');
    rootGroups.forEach(processRootGroup);
    notes.add(`All done`);
}
