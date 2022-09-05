import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { ByDomains, Duplicates, FileMeta, LoadedManifests, loadManifests, printDuplicates, printLoaded, splitByDomains } from './utils/utils-app';
import { makeXML } from './manifest';
import { osStuff } from './utils/utils-os';

function processFiles(fnames: string[]) {

    const loadedManifests = loadManifests(fnames);
    //printLoaded(loadedManifests);

    const byDomains = splitByDomains(loadedManifests.files);

    const domainsArr: Duplicates = Object.entries(byDomains);
    const duplicates = domainsArr.filter(([key, val]) => val.length > 1);

    // if (duplicates.length) {
    //     printDuplicates(duplicates);
    // } else {
    //     notes.add(`\nNothing done:\nThere are no duplicates in ${loadedManifests.files.length} loaded file${loadedManifests.files.length === 1 ? '' : 's'}.`);
    // }

    loadedManifests.files.forEach((f) => {
        const xml = makeXML(f.mani);
        if (xml) {
            const newDir = path.join(path.dirname(f.fname), 'new');
            const newFname = path.join(newDir, path.basename(f.fname));
            // const newFname = path.join(newDir, path.basename(f.fname, path.extname(f.fname)) + '_new') + path.extname(f.fname);

            osStuff.mkdirSync(newDir);
            fs.writeFileSync(newFname, xml);
        }
    });

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
