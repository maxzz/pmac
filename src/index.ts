import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { help, notes } from './utils/help';
import { getAndCheckTargets, getVerifiedFolders, Targets } from './utils/arguments';
import { buildManiMetaForms, parseXMLFile } from './manifest';

function processFiles(fnames: string[]) {

    //console.log(`targets ${JSON.stringify(fnames, null, 4)}`);

    for (const file of fnames) {
        const cnt = fs.readFileSync(file).toString();
        const { mani } = parseXMLFile(cnt);

        const forms = buildManiMetaForms(mani);

        notes.add(
            mani?.forms?.[0].detection?.web_ourl
                ? chalk.green(mani?.forms?.[0].detection?.web_ourl)
                : chalk.red(mani?.forms?.[0].detection?.web_ourl)
        );

        //console.log(`mani\n${JSON.stringify(mani, null, 4)}`);
    }
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
