import path from 'path';
import { exist } from './unique-names';
import { filterByExtension, getParentFolder } from './utils-app';
import { newErrorArgs } from './utils-errors';
import { osStuff } from './utils-os';

export type Targets = {
    files: string[];
    dirs: string[];
};

export function getAndCheckTargets(): Targets {
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

export function getVerifiedFolders({ files, dirs }: Targets): string[][] {
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
