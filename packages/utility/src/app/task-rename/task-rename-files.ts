import { RootGroup, TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { color, filterFilesByDomain } from "../../utils";
import { step1_LoadManifests } from "../task-common";
import path from "path";
import fs from "fs";

function getAutoName(prefix: string, domain: string): { ourAutoName: boolean; ending: string; } {
    const mOur = prefix.match(new RegExp(`^${domain}___(.*)`, 'i'));
    return {
        ourAutoName: !!mOur,
        ending: mOur ? mOur[1] : prefix,
    };
}

type RenamePair = { //TODO: check length root + dir + new name < 255
    oldName: string;
    newName: string;
};

const constWinApp = 'winapp';
const reWinApp = new RegExp(`${constWinApp}___`);
const reGuidMath = /(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/;

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    const renamePairs: RenamePair[] = [];

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);

        const m = filename.match(reGuidMath);
        if (m) {
            const [, prefixRaw, guid, suffix] = m;
            const domain = fileMeta.urls?.[0].oParts?.domain || constWinApp;
            const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

            if (addOrRemove) {
                if (ourAutoName) {
                    console.log(color.green(`${filename} already our name`));
                    return;
                }

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
                if (!ourAutoName) {
                    console.log(color.green(`${filename} not our name`));
                    return;
                }

                const newName = `${ending}${guid}${suffix}.dpm`;
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
            }
        } else {
            notes.add(color.red(`${fileMeta.short} has no guid filename match`));
        }
    });

    renamePairs.forEach((pair) => {
        fs.renameSync(pair.oldName, pair.newName);
    });

    renamePairs.forEach((pair) => {
        const n = color[pair.newName.match(reWinApp) ? 'yellow' : 'green'](pair.newName);
        console.log(`{\n    ${pair.oldName}\n    ${n}\n}`);
    });
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    //throw new Error('Not implemented yet');
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    notes.add(`All done`);
}

//TODO: ___mm_: ___cx_ ___cc_ ___ix_ ___mx_
//TODO: remove any filename prefixes not only ours: for add-prefix and remove-prefix; remove-existing
//TODO: interactive mode
