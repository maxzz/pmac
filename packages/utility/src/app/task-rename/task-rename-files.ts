import fs from "fs";
import path from "path";
import { type RootGroup, type TargetGroup } from "../../app-types";
import { appOptions, notes } from "../app-env";
import { color, filterFilesByDomain } from "../../utils";
import { addNoteIfEmptyAfterFilter, step1_LoadManifests } from "../task-common";

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    console.log(color.cyan(`Command <${addOrRemove ? 'add-prefixes' : 'remove-prefixes'}>:`));
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    notes.addProcessed(color.white(`\nAll done`));
}

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    const filteredOut = filterFilesByDomain(targetGroup.files, appOptions.domain);
    const gotEmptySet = !filteredOut.length && targetGroup.files.length && appOptions.domain;
    targetGroup.files = filteredOut;

    const detailedOutput = true;
    const renamePairs = prepareFilePairs(targetGroup, addOrRemove, detailedOutput);

    renamePairs.forEach(({oldName, newName}) => {
        fs.renameSync(oldName, newName);
    });

    detailedOutput && renamePairs.forEach(({ oldName, newName }) => {
        const name = color[newName.match(reWinApp) ? 'yellow' : 'green'](newName);
        notes.addProcessed(`{\n    ${oldName}\n    ${name}\n}`);
    });

    notes.addProcessed(`Source "${targetGroup.root}" has been processed. Updated manifests: ${renamePairs.length}`);
    gotEmptySet && addNoteIfEmptyAfterFilter('       ', appOptions);
}

type RenamePair = {
    oldName: string;
    newName: string;
};

function prepareFilePairs(targetGroup: TargetGroup, addOrRemove: boolean, detailedOutput: boolean): RenamePair[] {
    const renamePairs: RenamePair[] = [];
    const removeAny = appOptions.removeAny;

    targetGroup.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.short);
        const filename = path.basename(fileMeta.short);

        const m = filename.match(reGuidMath);
        if (!m) {
            notes.addProcessed(color.red(`${fileMeta.short} has no guid filename match`));
            return;
        }

        const [, prefixRaw, guid, suffix] = m;
        const domain = fileMeta.urls?.[0].oParts?.domain || constWinApp;
        const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

        let newShortName = '';

        if (addOrRemove) {
            if (ourAutoName) {
                detailedOutput && notes.addProcessed(color.green(`${filename} - already have a prefix`));
                return;
            }
            newShortName = `${domain}___${ending}${guid}${suffix}.dpm`;
        } else {
            if (!removeAny && !ourAutoName) {
                detailedOutput && notes.addProcessed(color.green(`${filename} - has no generated prefix`));
                return;
            }
            newShortName = `${removeAny ? '' : ending}${guid}${suffix}.dpm`;
        }

        const newFullName = path.join(targetGroup.root, dirname, newShortName);

        if (newFullName.length > 254) {
            notes.addProcessed(`The new name is too long (${newFullName.length}) for ${newFullName}`);
            return;
        }

        renamePairs.push({
            oldName: path.join(targetGroup.root, fileMeta.short),
            newName: newFullName,
        });
    });

    return renamePairs;
}

const constWinApp = 'winapp';
const reWinApp = new RegExp(`${constWinApp}___`);
const reGuidMath = /(.*)({[a-zA-Z0-9]{8,8}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{4,4}-[a-zA-Z0-9]{12,12}})(.*)\.dpm/;

function getAutoName(prefix: string, domain: string): { ourAutoName: boolean; ending: string; } {
    const mOur = prefix.match(new RegExp(`^${domain}___(.*)`, 'i'));
    return {
        ourAutoName: !!mOur,
        ending: mOur ? mOur[1] : prefix,
    };
}
