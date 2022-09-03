import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess, newErrorArgs } from './utils/utils-errors';
import { exist } from './utils/unique-names';
import { help, notes } from './utils/help';
import { osStuff } from './utils/utils-os';
import { filterByExtension, getParentFolder } from './utils/utils-app';

type Targets = {
    files: string[];
    dirs: string[];
};

function getAndCheckTargets(): Targets {
    let args = require('minimist')(process.argv.slice(2), {
    });

    let argTargets: string[] = args._ || [];

    let rv: Targets = { files: [], dirs: [], };

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

function getVerifiedFolders({ files, dirs }: Targets): string[][] {
    //console.log(`targets ${JSON.stringify({ files, dirs }, null, 4)}`);
    //help(); return;
    //await exitProcess(0, '');

    const rv: string[][] = [];

    if (files.length && dirs.length) {
        throw newErrorArgs('Nothing done:\nSpecify the folder name or file names, but not both.');
    }

    if (files.length) {
        const ourFiles = filterByExtension(files, '.dpm');
        const parent = getParentFolder(ourFiles);
        if (!ourFiles.length) {
            throw newErrorArgs(`Nothing done:\nThe files must have a ".dpm" extension.`);
        }
        if (!parent) {
            throw newErrorArgs('Nothing done:\nAll files must belong to the same folder.');
        }
        rv.push(ourFiles);
    }
    else if (dirs.length) {
        for (let dir of dirs) {
            const res = osStuff.collectDirItems(dir);
            const files: string[] = res.files.map((item) => path.join(dir, item.short));
            const ourFiles = filterByExtension(files, '.dpm');
            if (ourFiles.length) {
                rv.push(ourFiles);
            }
        }
    } else {
        throw newErrorArgs(`Nothing done:\nSpecify at leats one folder or files name to process.`);
    }

    return rv;
}

function processFiles(fnames: string[]) {

    console.log(`targets ${JSON.stringify(fnames, null, 4)}`);
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
    error.args && help(); // Show help if arguments are invalid

    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});
