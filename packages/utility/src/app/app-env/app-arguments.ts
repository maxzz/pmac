import path from 'path';
import prompts from 'prompts';
import { exist, exitProcess, newErrorArgs, OsStuff } from "../../utils";
import { type AppArgs, type AppOptions, type RootGroup, type ArgTarget } from '../../app-types';
import { getMinimistArgs, help, strDoneNothing, strDoNothingExit } from './app-help';
import { notes } from './app-notes';

export let appOptions: AppOptions = {};

export async function getAndCheckTargets(): Promise<AppArgs> {
    const {
        'dc': dc,
        'add-prefix': addPrefix,
        'remove-prefix': removePrefix,
        'help': shwoHelp,

        'need-backup': needBackup,
        'need-report': needReport,
        'need-update': needUpdate,
        'remove-any': removeAny,
        'generate-json': generateJson,

        domain,
        _: unnamed
    } = getMinimistArgs();

    if (shwoHelp) {
        help(true);
        await exitProcess(0, '');
    }

    if (+dc + +addPrefix + +removePrefix + +shwoHelp > 1) {
        throw new Error('Multiple commands are not allowed. Specify only one command.');
    }

    // 1. Get target folders first
    const rootGroups = getRootGroups(unnamed);

    // 2. Then complete with task to accomplish
    const appArgs: AppArgs = { dc, addPrefix, removePrefix, needBackup, needReport, needUpdate, removeAny, rootGroups: rootGroups, domain, };
    await checkOmittedArgs(appArgs);
    //console.log('appArgs', appArgs);

    appOptions = { 
        needBackup: appArgs.needBackup, 
        needReport: appArgs.needReport, 
        needUpdate: appArgs.needUpdate, 
        removeAny: appArgs.removeAny,
        domain,
        generateJson,
    };

    return appArgs;
}

async function checkOmittedArgs(appArgs: AppArgs) {
    const noTask = () => !appArgs.dc && !appArgs.addPrefix && !appArgs.removePrefix;
    if (noTask()) {
        await checkTaskTodo(appArgs);
        if (noTask()) {
            throw new Error(strDoNothingExit);
        }

        await checkTaskScope(appArgs);

        if (appArgs.dc) {
            appArgs.needBackup = await queryBoolean('Create back up files?', appArgs.needBackup, true);
            appArgs.needReport = await queryBoolean('Create report?', appArgs.needReport, true);
            appArgs.needUpdate = await queryBoolean('Modify files?', appArgs.needUpdate, true);
        }

        if (appArgs.removePrefix) {
            appArgs.removeAny = !await queryBoolean('Remove only automatically generated prefixes?', appArgs.removeAny, true);
        }
    }

    (typeof appArgs.needBackup !== 'boolean') && (appArgs.needBackup = true);
    (typeof appArgs.needReport !== 'boolean') && (appArgs.needReport = true);
    (typeof appArgs.needUpdate !== 'boolean') && (appArgs.needUpdate = true);
    (typeof appArgs.removeAny !== 'boolean') && (appArgs.removeAny = false);
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

function getArgTarget(unnamed: string[] = []): ArgTarget {
    let rv: ArgTarget = { files: [], dirs: [] };
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
            throw newErrorArgs(`Source "${target}" does not exist.`);
        }
    }
    return rv;
}

function getVerifiedFoldersWManifests({ files, dirs }: ArgTarget): RootGroup[] {
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
            if (fnames.length) {
                fnames.length && rv.push({ root, fnames });
            } else {
                notes.addProcessed(`Source "${root}" has no mainfest files.`);
            }
        }
    } else {
        throw newErrorArgs(`${strDoneNothing}. Specify at least one folder or filename(s) to process.`);
    }

    return rv;
}

function getRootGroups(unnamed: string[]) {
    let rootGroups: RootGroup[] = [];
    try {
        const argTarget = getArgTarget(unnamed);
        rootGroups = getVerifiedFoldersWManifests(argTarget);
    } catch (error) {
        throw error;
    }

    if (!rootGroups.length) {
        help();
        throw new Error(`${strDoneNothing}. There are no manifest files in the current folder.`);
    }

    return rootGroups;
}

async function queryBoolean(message: string, current: boolean | undefined, initial: boolean): Promise<boolean> {
    if (typeof current === 'boolean') {
        return current;
    }
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
