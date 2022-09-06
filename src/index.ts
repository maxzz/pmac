import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, TargetGroup, Targets } from './utils/arguments';
import { ByDomains, Duplicates, FileMeta, getParentFolder, LoadedManifests, loadManifests, makeBackupCopy, printDuplicates, printLoaded, splitByDomains } from './utils/utils-app';
import { makeXML } from './manifest';
import { osStuff } from './utils/utils-os';
import { ensureNameUnique, nowDayTime } from './utils/unique-names';
import { makeHtmlReport } from './utils/utils.report';

function processFiles(targetGroup: TargetGroup) {

    const loadedManifests = loadManifests(targetGroup);
    //printLoaded(loadedManifests);

    const byDomains = splitByDomains(loadedManifests.files);

    const domainsArr: Duplicates = Object.entries(byDomains);
    const duplicates = domainsArr.filter(([key, val]) => val.length > 1);

    // if (duplicates.length) {
    //     printDuplicates(duplicates);
    // } else {
    //     notes.add(`\nNothing done:\nThere are no duplicates in ${loadedManifests.files.length} loaded file${loadedManifests.files.length === 1 ? '' : 's'}.`);
    // }

    const parentFolder = targetGroup.root;

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
            const newFname = path.join(destFolder, f.short);
            fs.writeFileSync(newFname, xml);

            //const newDir = path.join(f.short, 'new');
            //const newFname = path.join(newDir, f.short);
            // const newFname = path.join(newDir, path.basename(f.short, path.extname(f.fname)) + '_new') + path.extname(f.fname);

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
