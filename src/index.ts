import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, TargetGroup, Targets } from './utils/arguments';
import { ByDomains, Duplicate, FileMeta, getDuplicates, LoadedManifests, printDuplicates, printLoaded, step_GetDuplicates, step_LoadManifests, step_MakeBackupCopy, step_MakeReport, step_ModifyDuplicates } from './utils/utils-app';
import { makeXML } from './manifest';
import { osStuff } from './utils/utils-os';
import { ensureNameUnique, nowDayTime } from './utils/unique-names';
import { makeHtmlReport } from './utils/utils-report';

function processFiles(targetGroup: TargetGroup) {

    const loadedManifests = step_LoadManifests(targetGroup);
    const duplicates = step_GetDuplicates(loadedManifests.files);
    if (!duplicates) {
        return;
    }

    const rootFolder = targetGroup.root;

    //TODO: use 'duplicates' instead of 'loadedManifests.files'

    step_MakeBackupCopy(loadedManifests.files, rootFolder);

    //TODO: place modified files into original folder
    step_ModifyDuplicates(duplicates);

    step_MakeReport(rootFolder);
}

async function main() {
    let targets: Targets = getAndCheckTargets();

    const filesByFolders = getVerifiedFolders(targets);

    for (let targetGroup of filesByFolders) {
        processFiles(targetGroup);
    }

    notes.show();
}

main().catch(async (error) => {
    error.args && help();
    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});

//TODO: save manifests - done
//TODO: backup by date
//TODO: HTML report
//TODO: show diff
