import fs from "fs";
import path from "path";
import { type RootGroup, type SingleFolder } from "../9-types";
import { appOptions, Notes } from "../8-app-env";
import { color } from "../../utils";
import { addNoteIfEmptyAfterFilter, filterFilesByDomain, step1_LoadManifests } from "../4-common-tasks";

export function executeTaskRename(rootGroups: RootGroup[], addOrRemove: boolean) {
    console.log(color.cyan(`Command <${addOrRemove ? 'add-prefixes' : 'remove-prefixes'}>:`));
    rootGroups.forEach((rootGroup) => processRootGroup(rootGroup, addOrRemove));
    Notes.addProcessed(color.white(`\nAll done`));
}

function processRootGroup(rootGroup: RootGroup, addOrRemove: boolean) {
    const targetGroup = step1_LoadManifests(rootGroup);
    const filteredOut = filterFilesByDomain(targetGroup.files, appOptions.domain);
    const gotEmptySet = !filteredOut.length && targetGroup.files.length && appOptions.domain;
    targetGroup.files = filteredOut;

    const detailedOutput = true;
    const renamePairs = prepareFilePairs(targetGroup, addOrRemove, detailedOutput);

    renamePairs.forEach(
        ({ oldName, newName }) => {
            fs.renameSync(oldName, newName);
        }
    );

    detailedOutput && renamePairs.forEach(
        ({ oldName, newName }) => {
            const name = color[newName.match(reWinApp) ? 'yellow' : 'green'](newName);
            Notes.addProcessed(`{\n    ${oldName}\n    ${name}\n}`);
        }
    );

    Notes.addProcessed(`Source "${targetGroup.rootFolder}" has been processed. Updated manifests: ${renamePairs.length}`);
    gotEmptySet && addNoteIfEmptyAfterFilter('       ', appOptions);
}

type RenamePair = {
    oldName: string;
    newName: string;
};

function prepareFilePairs(singleFolder: SingleFolder, addOrRemove: boolean, detailedOutput: boolean): RenamePair[] {
    const renamePairs: RenamePair[] = [];
    const removeAny = appOptions.removeAny;

    singleFolder.files.forEach((fileMeta) => {
        const dirname = path.dirname(fileMeta.relativeFname);
        const filename = path.basename(fileMeta.relativeFname);

        const m = filename.match(reGuidMath);
        if (!m) {
            Notes.addProcessed(color.red(`${fileMeta.relativeFname} has no guid filename match`));
            return;
        }

        const [, prefixRaw, guid, suffix] = m;
        const domain = fileMeta.urls?.[0].oUrlSplit?.domain || constWinApp;
        const { ourAutoName, ending } = getAutoName(prefixRaw, domain);

        let newShortName = '';

        if (addOrRemove) {
            if (ourAutoName) {
                detailedOutput && Notes.addProcessed(color.green(`${filename} - already have a prefix`));
                return;
            }
            newShortName = `${domain}___${ending}${guid}${suffix}.dpm`;
        } else {
            if (!removeAny && !ourAutoName) {
                detailedOutput && Notes.addProcessed(color.green(`${filename} - has no generated prefix`));
                return;
            }
            newShortName = `${removeAny ? '' : ending}${guid}${suffix}.dpm`;
        }

        const newFullName = path.join(singleFolder.rootFolder, dirname, newShortName);

        if (newFullName.length > 254) {
            Notes.addProcessed(`The new name is too long (${newFullName.length}) for ${newFullName}`);
            return;
        }

        renamePairs.push({
            oldName: path.join(singleFolder.rootFolder, fileMeta.relativeFname),
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
