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

const constWinApp = 'winapp';
const reWinApp = new RegExp(`${constWinApp}___`);
const reGuidMath = /(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/;

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    filterFilesByDomain(targetGroup, appOptions.domain);

    type RenamePair = {
        oldName: string;
        newName: string;
    };

    const renamePairs: RenamePair[] = [];
    const removeAny = appOptions.removeAny;
    const detailedOutput = true;

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);

        const m = filename.match(reGuidMath);
        if (m) {
            const [, prefixRaw, guid, suffix] = m;
            const domain = fileMeta.urls?.[0].oParts?.domain || constWinApp;
            const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

            let newFullName = '';

            if (addOrRemove) {
                if (ourAutoName) {
                    detailedOutput && notes.add(color.green(`${filename} already our name`));
                    return;
                }
                const newShortName = `${domain}___${ending}${guid}${suffix}.dpm`;
                newFullName = path.join(rootGroup.root, dirname, newShortName);
            } else {
                if (!removeAny && !ourAutoName) {
                    detailedOutput && notes.add(color.green(`${filename} not our name`));
                    return;
                }
                const newShortName = `${removeAny ? '' : ending}${guid}${suffix}.dpm`;
                newFullName = path.join(rootGroup.root, dirname, newShortName);
            }

            if (newFullName.length > 254) {
                notes.add(`The new name is too long (${newFullName.length}) for ${newFullName}`);
                return;
            }

            renamePairs.push({
                oldName: path.join(rootGroup.root, fileMeta.short),
                newName: newFullName,
            });
        } else {
            notes.add(color.red(`${fileMeta.short} has no guid filename match`));
        }
    });

    renamePairs.forEach((pair) => {
        fs.renameSync(pair.oldName, pair.newName);
    });

    detailedOutput && renamePairs.forEach(({ oldName, newName }) => {
        const name = color[newName.match(reWinApp) ? 'yellow' : 'green'](newName);
        notes.add(`{\n    ${oldName}\n    ${name}\n}`);
    });
}

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    notes.add(color.cyan(`Command: ${addOrRemove ? 'add prefixes' : 'remove prefixes'}`));
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    notes.add(`All done`);
}

//throw new Error('Not implemented yet');
//TODO: ___mm_: ___cx_ ___cc_ ___ix_ ___mx_
//TODO: remove any filename prefixes not only ours: for add-prefix and remove-prefix; remove-existing
//TODO: interactive mode
