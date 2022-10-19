import chalk from 'chalk';
import path from 'path';
import { exist } from '../utils/unique-names';
import { newErrorArgs } from '../utils/utils-errors';
import { osStuff } from '../utils/utils-os';
import prompts from 'prompts';
import { getMinimistArgs, MinimistArgs } from './app-help';

export type Targets = {
    files: string[];
    dirs: string[];
};

type RealArgs = {
    dc: boolean;
    addPrefix: boolean;
    removePrefix: boolean;
    targets: Targets;
};

async function getTaskTodo(realArgs: RealArgs) {
    const noTask = () => !realArgs.dc && !realArgs.addPrefix && !realArgs.removePrefix;
    if (noTask()) {
        const questions: prompts.PromptObject[] = [
            {
                type: 'select',
                name: 'job',
                message: 'Select a task to complete',
                choices: [
                    { title: 'Domain credentials', value: 'dc', description: 'Switch to credentials that apply only to a specific URL', },
                    { title: 'Add prefix', value: 'addPrefix', description: 'Add domain name as prefix to manifest filenames', },
                    { title: 'Remove prefix', value: 'removePrefix', description: 'Remove domain name prefix from manifest filenames', },
                    { title: 'Exit', value: '', description: 'Do nothing, just exit' },
                ],
                initial: 0,
            },
        ];
        const response = await prompts(questions);
        response.job && (realArgs[response.job as keyof Omit<RealArgs, 'targets'>] = true);
        if (noTask()) {
            throw new Error('Chosen to do nothing, just exit.');
        }
    }
}

function getTargets(unnamed: string[] = []): Targets {
    let rv: Targets = { files: [], dirs: [] };
    for (let target of unnamed) {
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

export async function getAndCheckTargets(): Promise<Targets> {
    let args: MinimistArgs = getMinimistArgs();
    const { 'dc': dc, 'add-prefix': addPrefix, 'remove-prefix': removePrefix } = args;
    const realArgs: RealArgs = { dc, addPrefix, removePrefix, targets: getTargets(args._) };

    await getTaskTodo(realArgs);
    console.log('realArgs', realArgs);

    //return { files: [], dirs: [] };
    return realArgs.targets;
}

export type SourceGroup = {
    root: string;       // this group root folder
    fnames: string[];   // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};

export function getVerifiedFolders({ files, dirs }: Targets): SourceGroup[] {
    //console.log(`targets ${JSON.stringify({ files, dirs }, null, 4)}`);
    //help(); return;
    //await exitProcess(0, '');

    const rv: SourceGroup[] = [];

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
            const filesAndDirs = osStuff.collectDirItems(root);

            let files = filesAndDirs.files;
            const pmTestFolder = filesAndDirs.subs.find((dir) => path.basename(dir.name).toLowerCase() === 'c');
            if (pmTestFolder) {
                const fnameWSubs = pmTestFolder.files.map((fileItem) => ({ ...fileItem, short: path.join('C', fileItem.short) }));
                files = files.concat(fnameWSubs);
            }

            const fnames = osStuff.filterByExtension(files.map((item) => item.short), '.dpm');
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
