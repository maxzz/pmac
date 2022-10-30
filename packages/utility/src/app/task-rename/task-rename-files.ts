import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { color, filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";
import path from "path";

function getAutoName(prefix: string, domain: string): { ourAutoName: boolean; ending: string; } {
    const mOur = prefix.match(new RegExp(`^${domain}___([\s\S]*)`, 'i'));
    return {
        ourAutoName: !!mOur,
        ending: mOur ? mOur[1] : prefix,
    };
}

type RenamePair = { //TODO: check length root + dir + new name < 255
    oldName: string;
    newName: string;
};

const winappPrefix = 'winapp';

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    const renamePairs: RenamePair[] = [];

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);

        const m = filename.match(/(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/);
        if (m) {
            const [, prefixRaw, guid, suffix] = m;
            const domain = fileMeta.urls?.[0].oParts?.domain || winappPrefix;
            const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

            if (addOrRemove) {
                if (!ourAutoName) {
                    const newName = `${domain}___${ending}${guid}${suffix}.dpm`;
                    const fullName = path.join(rootGroup.root, dirname, newName);

                    if (fullName.length > 255) {
                        notes.add(`The new name is too long (${fullName.length}) for ${fullName}`);
                        return;
                    }

                    console.log(color.cyan(newName));

                    renamePairs.push({
                        oldName: path.join(rootGroup.root, fileMeta.short),
                        newName: fullName,
                    });
                } else {
                    console.log(color.green(`${filename} already our name`));
                }
            } else {

            }
        } else {
            notes.add(color.red(`${fileMeta.short} has no guid filename match`));
        }
    });

    renamePairs.forEach((pair) => {
        const isWinApp = pair.newName.match(new RegExp(`${winappPrefix}___`));
        const n = color[isWinApp ? 'yellow' : 'green'](pair.newName);
        console.log(`{\n    ${pair.oldName}\n    ${n}\n}`);
    });
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    //throw new Error('Not implemented yet');
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    notes.add(`All done`);
}

//TODO: ___mm_
//TODO: remove any filename prefixes not only ours: for add-prefix and remove-prefix
//TODO: interactive mode
