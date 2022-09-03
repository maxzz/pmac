import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { exist } from './utils/unique-names';
import { help, notes } from './utils/help';
import { osStuff } from './utils/utils-os';

type StartArgs = {
    files: string[];
    dirs: string[];
    singleTm?: boolean; // In this case run dir on parent of 'tm' folder.
};

function getAndCheckArg(): StartArgs {
    let args = require('minimist')(process.argv.slice(2), {
    });

    // console.log(`args ${JSON.stringify(args, null, 4)}`);
    // await exitProcess(0, '');

    let argTargets: string[] = args._ || [];

    let rv: { files: string[], dirs: string[], } = {
        files: [],
        dirs: [],
    };

    for (let target of argTargets) {
        let current: string = path.resolve(target); // relative to the start up folder
        let st = exist(current);
        if (st) {
            if (st.isDirectory()) {
                rv.dirs.push(current);
            } else if (st.isFile()) {
                rv.files.push(current); // TODO: Check all files should have the same root folder. That is not possible with drag and drop, but still ...
            }
        } else {
            throw newErrorArgs(`Target "${target}" does not exist.`);
        }
    }

    return rv;
}

async function checkArgs({ files, dirs }: StartArgs) {

    //console.log(`targets ${JSON.stringify({ files, dirs }, null, 4)}`);
    //help(); return;
    //await exitProcess(0, '');

    if (files.length && dirs.length) {
        throw newErrorArgs('Nothing done:\nSpecify the folder name or file names, but not both.');
    }

}

function processFiles(fnames: string[]) {

    const ourFiles = fnames.filter((item) => path.extname(item).toLowerCase() === '.dpm');

    console.log(`targets ${JSON.stringify(ourFiles, null, 4)}`);
}

async function main() {
    let targets: StartArgs = getAndCheckArg();

    await checkArgs(targets);

    if (targets.files.length) {
        processFiles(targets.files);
    }
    else if (targets.dirs.length) {
        for (let dir of targets.dirs) {
            const res = osStuff.collectDirItems(dir);
            const files: string[] = res.files.map((item)=> path.resolve(dir, item.short));
            processFiles(files);
        }
    } else {
        throw newErrorArgs(`Nothing done:\nSpecify at leats one folder or files name to process.`);
    }

    notes.show();
}

main().catch(async (error) => {
    error.args && help(); // Show help if arguments are invalid

    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});
