import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { Mani, Meta, } from './manifest';
import { FileMeta, LoadedManifests, loadManifests, printLoaded } from './utils/utils-app';

function processFiles(fnames: string[]) {

    const loadedManifests = loadManifests(fnames);

    const files = loadedManifests.files;
    const byDomains: Record<string, FileMeta[]> = {};

    files.forEach((file) => {
        const domain = file.urls[0]?.oParts?.domain;
        if (domain) {
            !byDomains[domain] && (byDomains[domain] = []);
            byDomains[domain].push(file);
        }
    });

    const entries = Object.entries(byDomains).map(([key, val]) => val.length > 1 ? chalk.red(`${key} ${val.length}`) : `${key} ${val.length}`);

    entries.forEach((item) => {
        console.log(item);
    });

    //console.log(JSON.stringify(entries, null, 2));

    //printLoaded(loadedManifests);


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
