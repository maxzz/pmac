import color from "picocolors";
import path from 'path';
import { exist } from '../utils/unique-names';
import { newErrorArgs } from '../utils/utils-errors';
import { OsStuff } from '../utils/utils-os';
import prompts from 'prompts';
import { AppArgs, SourceGroup, Targets } from './app-types';
import { getMinimistArgs, strDoneNothing } from './app-help';

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

function getVerifiedFoldersWManifests({ files, dirs }: Targets): SourceGroup[] {
    //console.log(`targets ${JSON.stringify({ files, dirs }, null, 4)}`);
    //help(); return;
    //await exitProcess(0, '');

    const rv: SourceGroup[] = [];

    if (files.length && dirs.length) {
        throw newErrorArgs(`${strDoneNothing}. Specify the folder name or file names, but not both.`);
    }

    if (files.length) {
        const ourFiles = OsStuff.filterByExtension(files, '.dpm');
        if (!ourFiles.length) {
            throw newErrorArgs(`${strDoneNothing}. There is no files with ".dpm" extension.`);
        }

        const root = OsStuff.getParentFolder(ourFiles);
        if (!root) {
            throw newErrorArgs(`${strDoneNothing}. All files must belong to the same folder.`); // Cannot get destination folder (files from multiple folders)
        }

        const shortFnames = ourFiles.map((fname) => path.basename(fname));
        rv.push({ root, fnames: shortFnames });
    }
    else if (dirs.length) {
        for (let root of dirs) {
            const filesAndDirs = OsStuff.collectDirItems(root);

            let files = filesAndDirs.files;
            const pmTestFolder = filesAndDirs.subs.find((dir) => path.basename(dir.name).toLowerCase() === 'c'); // A(InUse), B(NotInUse), and C(NotInUseTest)
            if (pmTestFolder) {
                const fnameWSubs = pmTestFolder.files.map((fileItem) => ({ ...fileItem, short: path.join('C', fileItem.short) }));
                files = files.concat(fnameWSubs);
            }

            const fnames = OsStuff.filterByExtension(files.map((item) => item.short), '.dpm');
            fnames.length && rv.push({ root, fnames });
        }
    } else {
        throw newErrorArgs(`${strDoneNothing}. Specify at leats one folder or files name to process.`);
    }

    return rv;
}

async function checkTaskTodo(appArgs: AppArgs) {
    const noTask = () => !appArgs.dc && !appArgs.addPrefix && !appArgs.removePrefix;
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
                    { title: 'Exit', value: 'none', description: 'Do nothing, just exit' },
                ],
                initial: 0,
            },
        ];
        const response = await prompts(questions);
        response.job && (appArgs[response.job as keyof Omit<AppArgs, 'sourceGroups' | 'domain'>] = true);
        if (noTask()) {
            throw new Error('Chosen to do nothing, just exit.');
        }
    }
}

async function checkTaskScope(appArgs: AppArgs) {
    const noDomain = () => !appArgs.dc && !appArgs.addPrefix && !appArgs.removePrefix;
    if (noDomain()) {
        const questions: prompts.PromptObject[] = [
            {
                type: 'select',
                name: 'job',
                message: 'Select a task to complete',
                choices: [
                    { title: 'Domain credentials', value: 'dc', description: 'Switch to credentials that apply only to a specific URL', },
                    { title: 'Add prefix', value: 'addPrefix', description: 'Add domain name as prefix to manifest filenames', },
                    { title: 'Remove prefix', value: 'removePrefix', description: 'Remove domain name prefix from manifest filenames', },
                    { title: 'Exit', value: 'none', description: 'Do nothing, just exit' },
                ],
                initial: 0,
            },
        ];
        const response = await prompts(questions);
        response.job && (appArgs[response.job as keyof Omit<AppArgs, 'sourceGroups' | 'domain'>] = true);
        if (noDomain()) {
            throw new Error('Chosen to do nothing, just exit.');
        }
    }
}

export async function getAndCheckTargets(): Promise<AppArgs> {
    const { 'dc': dc, 'add-prefix': addPrefix, 'remove-prefix': removePrefix, domain, _: unnamed } = getMinimistArgs();

    // 1. Get target folders first
    let sourceGroups: SourceGroup[] = [];
    try {
        const targets = getTargets(unnamed);
        sourceGroups = getVerifiedFoldersWManifests(targets);
    } catch (error) {
        throw error;
    }

    if (!sourceGroups.length) {
        throw new Error(`${strDoneNothing}. There are no manifest files in the current folder.`);
    }

    // 2. Then complete with task to accomplish
    const appArgs: AppArgs = { dc, addPrefix, removePrefix, sourceGroups, domain };
    await checkTaskTodo(appArgs);

    return appArgs;
}

//TODO: what to do if no folders; use current?

//TODO: promt process after operation selected:
//  dc: folder, domain
//  add prefix: folders, file, domain
//  remove prefix: folders, file, domain

//TODO: --d donain to +/- as prefix