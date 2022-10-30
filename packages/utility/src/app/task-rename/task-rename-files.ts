import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { color, filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";
import path from "path";

function getAutoName(prefix: string, domain: string): { ourAutoName: boolean; ending: string; } {
    const mOur = prefix.match(new RegExp(`^${domain}___([\s\S]*)`));
    return {
        ourAutoName: !!mOur,
        ending: mOur ? mOur[1] : prefix,
    };
}

type RenamePair = { //TODO: check length root + dir + new name < 255
    oldName: string;
    newName: string;
};

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    const renamePairs: RenamePair[] = [];

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);
        //console.log(`    dir: ${dirname} filename: ${filename}`);

        const m = filename.match(/(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/);
        if (m) {
            const [, prefixRaw, guid, suffix] = m;

            const domain = fileMeta.urls?.[0].oParts?.domain || '';
            if (!domain) {
                console.log(color.yellow(`${filename} not a website`));
                return;
            }

            const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

            if (addOrRemove) {
                if (!ourAutoName) {
                    const newName = `${domain}___${ending}${guid}${suffix}.dpm`;
                    const fullName = path.join(rootGroup.root, dirname, newName);
                    if (fullName.length > 255) {
                        console.log(`The new name is too long (${fullName.length}) for ${fullName}`);
                        return;
                    } else {
                        console.log(`${fullName}`);
                    }
                } else {
                    console.log(color.green(`already our name ${filename}`));
                }
            } else {

            }

            //console.log(`url: ${domain}___${guid}${suffix}.dpm was: ${ourAutoName ? '___' : '   '} a:'${ending}'`); //TODO: 'C\\{63b8feef-c560-4777-b26a-70413303c096}.dpm', // path.basename
            // console.log(`b: ${guid} c:'${suffix}' ${isAuto ? '___' : '   '} auto:'${prefix}' url: ${domain} a:'${prefixRaw}'`); //TODO: 'C\\{63b8feef-c560-4777-b26a-70413303c096}.dpm', // path.basename

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
