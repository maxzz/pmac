import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, help, newErrorArgs, notes } from './process-utils';
import { exist } from './unique-names';

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

    let rv: {
        files: string[],
        dirs: string[],
    } = {
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

function processFiles(targets: StartArgs) {

}

async function main() {
    let targets: StartArgs = getAndCheckArg();
    processFiles(targets);

    // console.log(`targets ${JSON.stringify(targets, null, 4)}`);
    // await exitProcess(0, '');

    // if (targets.files.length) {
    //     // 1. all mixed content goes to tm.rar (files and folders).
    //     const toRar = [...targets.files, ...targets.dirs]; // TOOO: Check: all files and folders should be inside the same folder (although it isn't possible with drag&drop).
    //     createTmRarFromDroppedItems(toRar, targets.singleTm);
    // }
    // else if (targets.dirs.length) {
    //     // 2. treat each folder separately.
    //     for (let dir of targets.dirs) {
    //         handleFolder(dir);
    //     }
    // } else {
    //     throw newErrorArgs(`Specify at leats one folder or files name to process.`);
    // }

    // notes.show();
}

main().catch(async (error) => {
    error.args && help(); // Show help if args are invalid
    await exitProcess(1, `${notes.buildMessage()}${chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`)}`);
});