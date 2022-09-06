import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { ByDomains, Duplicates, FileMeta, getParentFolder, LoadedManifests, loadManifests, makeBackupCopy, printDuplicates, printLoaded, splitByDomains } from './utils/utils-app';
import { makeXML } from './manifest';
import { osStuff } from './utils/utils-os';
import { ensureNameUnique, nowDayTime } from './utils/unique-names';
import { makeHtmlReport } from './utils/utils.report';

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

    const parentFolder = loadedManifests.files.length ? getParentFolder(fnames) : '';
    if (!parentFolder) {
        throw newErrorArgs('Cannot get destination folder (files from multiple folders).');
    }

    //TODO: use 'duplicates' instead of 'loadedManifests.files'

    try {
        makeBackupCopy(loadedManifests.files, parentFolder);
    } catch (error) {
        throw new Error(`Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.`);
    }

    const report = makeHtmlReport({here2: 'we go 7'});
    if (report) {
        //TODO: save it into the same folder
    }

    notes.add(`All done in folder ${parentFolder}`);

    return;

    //TODO: place modified files into original folder

    const destFolder = ensureNameUnique(`${parentFolder}/new ${nowDayTime()}`, false);
    osStuff.mkdirSync(destFolder);

    loadedManifests.files.forEach((f) => {
        const xml = makeXML(f.mani);
        if (xml) {
            const newFname = path.join(destFolder, path.basename(f.fname));
            fs.writeFileSync(newFname, xml);

            //const newDir = path.join(path.dirname(f.fname), 'new');
            //const newFname = path.join(newDir, path.basename(f.fname));
            // const newFname = path.join(newDir, path.basename(f.fname, path.extname(f.fname)) + '_new') + path.extname(f.fname);

            //osStuff.mkdirSync(newDir);
            //fs.writeFileSync(newFname, xml);
        }
    });

    //TODO: save manifests - done
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
