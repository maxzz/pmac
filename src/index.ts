import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { buildManiMetaForms, Mani, Meta, parseXMLFile } from './manifest';
import { loadManifests } from './utils/utils-app';

function processFiles(fnames: string[]) {

    //console.log(`targets ${JSON.stringify(fnames, null, 4)}`);

    const loadedManifests = loadManifests(fnames);

    loadedManifests.files.forEach((file) => {

        const detectionA = file?.mani?.forms?.[0]?.detection;
        const detectionB = file?.mani?.forms?.[1]?.detection;

        if (detectionA?.web_ourl || detectionB?.web_ourl) {
            notes.add('--------------------------------');
            detectionA?.web_ourl && notes.add(`    0: ${chalk.green(detectionA?.web_ourl)}`);
            detectionB?.web_ourl && notes.add(`    1: ${chalk.green(detectionB?.web_ourl)}`);
        }
    });

    loadedManifests.empty.forEach((file) => {
        notes.add(chalk.bgBlue.green(`empty --------------------------------${path.basename(file)}`));
    });

    loadedManifests.failed.forEach((file) => {
        notes.add(chalk.bgBlue.green(`failed --------------------------------${path.basename(file)}`));
    });

    //console.log(`mani\n${JSON.stringify(mani, null, 4)}`);
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
