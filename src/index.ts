import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { Mani, Meta, } from './manifest';
import { ByDomains, FileMeta, LoadedManifests, loadManifests, printDuplicates, printLoaded, splitByDomains } from './utils/utils-app';

function processFiles(fnames: string[]) {

    const loadedManifests = loadManifests(fnames);

    const byDomains: ByDomains = splitByDomains(loadedManifests.files);

    printDuplicates(byDomains);

    //console.log(JSON.stringify(entries, null, 2));

    //printLoaded(loadedManifests);

    //TODO: save manifests
    //TODO: backup by date
    //TODO: HTML report
    //TODO: show diff
}

async function main() {
    let targets: Targets = getAndCheckTargets();

    const filesByFolders = getVerifiedFolders(targets);

    for (let files of filesByFolders) {
        processFiles(files);
    }

    notes.show();
}

main().catch(async (error) => {
    error.args && help();
    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});
