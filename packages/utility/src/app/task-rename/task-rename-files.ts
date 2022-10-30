import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { color, filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";
import path from "path";

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);
        //console.log(`    dir: ${dirname} filename: ${filename}`);

        const m = filename.match(/(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/);
        if (m) {
            const [, prefix, name, suffix] = m;

            let prefixName = name;
            let isAutoName = false;
            const mOur = prefix.match(/([\s\S]*)(___)$/);
            if (mOur) {
                prefixName = mOur[1];
                isAutoName = true;
            }

            if (addOrRemove) {

            } else {

            }

            console.log(`prefix: '${prefix}' guid: ${name} suffix: '${suffix}' isAutoName = ${isAutoName} prefixName: '${prefixName}'`); //TODO: 'C\\{63b8feef-c560-4777-b26a-70413303c096}.dpm', // path.basename
        } else {
            console.log(color.red(`no match ${fileMeta.short}`));
        }
    });
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    //throw new Error('Not implemented yet');
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    notes.add(`All done`);
}
