import path from 'path';
import { exist } from './unique-names';
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

export type TargetGroup = {
    root: string;
    fnames: string[]; // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};

export function getVerifiedFolders({ files, dirs }: Targets): TargetGroup[] {
    //console.log(`targets ${JSON.stringify({ files, dirs }, null, 4)}`);
    //help(); return;
    //await exitProcess(0, '');

    const rv: TargetGroup[] = [];

    if (files.length && dirs.length) {
        throw newErrorArgs('Nothing done:\nSpecify the folder name or file names, but not both.');
    }

    if (files.length) {
        const ourFiles = osStuff.filterByExtension(files, '.dpm');
        if (!ourFiles.length) {
            throw newErrorArgs(`Nothing done:\nThere is no files with ".dpm" extension.`);
        }

        const root = osStuff.getParentFolder(ourFiles);
        if (!root) {
            throw newErrorArgs('Nothing done:\nAll files must belong to the same folder.'); // Cannot get destination folder (files from multiple folders)
        }

        const shortFnames = ourFiles.map((fname) => path.basename(fname));
        rv.push({ root, fnames: shortFnames });
    }
    else if (dirs.length) {
        for (let root of dirs) {
            const res = osStuff.collectDirItems(root);
            const fnames = osStuff.filterByExtension(res.files.map((item) => item.short), '.dpm');
            if (fnames.length) {
                rv.push({ root, fnames });
            }
        }
    } else {
        throw newErrorArgs(`Nothing done:\nSpecify at leats one folder or files name to process.`);
    }

    //TODO: add A(InUse), B(NotInUse), and C(NotInUseTest) to each TargetGroup

    //throw 'not now';

    return rv;
}