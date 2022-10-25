import color from "picocolors";
import path from 'path';
import prompts from 'prompts';
import { exist } from '../utils/unique-names';
import { exitProcess, newErrorArgs } from '../utils/utils-errors';
import { OsStuff } from '../utils/utils-os';
import { AppArgs, AppOptions, RootGroup, Targets } from './app-types';
import { getMinimistArgs, help, strDoneNothing, strDoNothingExit } from './app-help';

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

function getVerifiedFoldersWManifests({ files, dirs }: Targets): RootGroup[] {
    const rv: RootGroup[] = [];

    if (files.length && dirs.length) {
        throw newErrorArgs(`${strDoneNothing}. Specify the folder name or file names, but not both.`);
    }

    if (!files.length && !dirs.length) {
        dirs.push(path.resolve('.'));
    }

    if (files.length) {
        const ourFiles = OsStuff.filterByExtension(files, '.dpm');
        if (!ourFiles.length) {
            throw newErrorArgs(`${strDoneNothing}. There is no files with ".dpm" extension.`);
        }

        const root = OsStuff.getParentFolder(ourFiles);
        if (!root) {
            throw newErrorArgs(`${strDoneNothing}. All files must be in the same folder.`); // Cannot get destination folder (files from multiple folders); or we can split them multiple sources
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
        throw newErrorArgs(`${strDoneNothing}. Specify at least one folder or filename(s) to process.`);
    }

    return rv;
}

function getRootGroups(unnamed: string[]) {
    let rootGroups: RootGroup[] = [];
    try {
        const targets = getTargets(unnamed);
        rootGroups = getVerifiedFoldersWManifests(targets);
    } catch (error) {
        throw error;
    }

    if (!rootGroups.length) {
        help();
        throw new Error(`${strDoneNothing}. There are no manifest files in the current folder.`);
    }

    return rootGroups;
}

async function queryBoolean(message: string, initial: boolean): Promise<boolean> {
    const question: prompts.PromptObject[] = [
        {
            type: 'confirm',
            name: 'value',
            message,
            initial,
        },
    ];
    const { value } = await prompts(question);
    return value;
}

async function checkTaskScope(appArgs: AppArgs) {
    const noDomain = () => !appArgs.domain;
    if (noDomain()) {
        // 1. All files or domain
        const questions1: prompts.PromptObject[] = [
            {
                type: 'select',
                name: 'all',
                message: 'Process all files or a specific domain',
                choices: [
                    { title: 'All files', value: true, },
                    { title: 'Specific domain', value: false, description: 'process files only for a specific domain', },
                ],
                initial: 0,
            },
        ];
        const response1 = await prompts(questions1);
        if (response1.all) {
            return;
        }
        // 2. Get domain
        const questions2: prompts.PromptObject[] = [
            {
                type: 'text',
                name: 'domain',
                message: 'What domain to process?',
                validate: (input: string) => !!input.trim() ? true : 'Enter a domain name, for example, google.com',
            },
        ];
        const response2 = await prompts(questions2);
        const domain = (response2.domain as string || '').trim().toLowerCase();
        if (!domain) {
            throw new Error(strDoNothingExit);
        }
        appArgs.domain = domain;
    }
}

async function checkTaskTodo(appArgs: AppArgs) {
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
    response.job && (appArgs[response.job as keyof Omit<AppArgs, 'rootGroups' | 'domain'>] = true);
}

async function checkOmmitedArgs(appArgs: AppArgs) {
    const noTask = () => !appArgs.dc && !appArgs.addPrefix && !appArgs.removePrefix;
    if (noTask()) {
        await checkTaskTodo(appArgs);
        if (noTask()) {
            throw new Error(strDoNothingExit);
        }

        await checkTaskScope(appArgs);

        appArgs.noBackup = await queryBoolean('Create back up files?', true);
        appArgs.noReport = await queryBoolean('Create report?', true);
        appArgs.noBackup = await queryBoolean('Modify files?', true);
    }
}

export let appOptions: AppOptions = {};

export async function getAndCheckTargets(): Promise<AppArgs> {
    const {
        'dc': dc,
        'add-prefix': addPrefix,
        'remove-prefix': removePrefix,
        'help': shwoHelp,

        'no-backup': noBackup,
        'no-report': noReport,
        'no-update': noUpdate,

        domain,
        _: unnamed
    } = getMinimistArgs();

    if (shwoHelp) {
        help(true);
        await exitProcess(0, '');
    }

    // 1. Get target folders first
    const rootGroups = getRootGroups(unnamed);

    // 2. Then complete with task to accomplish
    const appArgs: AppArgs = { dc, addPrefix, removePrefix, noBackup, noReport, noUpdate, rootGroups: rootGroups, domain, };
    await checkOmmitedArgs(appArgs);

    appOptions = { noBackup, noReport, noUpdate, domain, };

    return appArgs;
}
