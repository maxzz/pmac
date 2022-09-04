import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { Mani, manifestToJsonForXml, Meta, parseOptions, } from './manifest';
import { ByDomains, Duplicates, FileMeta, LoadedManifests, loadManifests, printDuplicates, printLoaded, splitByDomains } from './utils/utils-app';
import { J2xParser } from './utils/json2xml';

function processFiles(fnames: string[]) {

    const loadedManifests = loadManifests(fnames);
    printLoaded(loadedManifests);

    const byDomains = splitByDomains(loadedManifests.files);

    const domainsArr: Duplicates = Object.entries(byDomains);
    const duplicates = domainsArr.filter(([key, val]) => val.length > 1);

    // if (duplicates.length) {
    //     printDuplicates(duplicates);
    // } else {
    //     notes.add(`\nNothing done:\nThere are no duplicates in ${loadedManifests.files.length} loaded file${loadedManifests.files.length === 1 ? '' : 's'}.`);
    // }

    const f = loadedManifests.files[0];
    if (f) {
        let rv = f.mani && manifestToJsonForXml(f.mani) || '';

        const j2xParser = new J2xParser({ ...parseOptions, format: true, indentBy: '    ', });
        let xml = j2xParser.parse(rv);
        xml = `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
     
        console.log('%c---------new xml from converted---------', 'color: green', `\n${xml}`);
    }

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
