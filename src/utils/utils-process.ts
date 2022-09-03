import chalk from 'chalk';
let cfg = require('../../package.json');

const { name: programName } = cfg;

export async function exitProcess(exitCode: number, msg: string): Promise<void> {
    async function pressAnyKey(msg: string = '\nPress any key ...') {
        return new Promise(resolve => {
            if (process.stdin.isTTY) {
                console.log(msg);

                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.on('data', resolve);
            }
            else {
                console.log(' ');
                resolve(void 0);
            }
        });
    }

    console.log(msg);
    await pressAnyKey();
    process.exit(exitCode);
}

interface ErrorArgs extends Error {
    args: boolean;
}

export function newErrorArgs(msg: string): ErrorArgs {
    let error = new Error(msg) as ErrorArgs;
    error.args = true;
    return error;
}

export function help() {
    let msg = `
The ${chalk.cyan(`${programName}`)} utility converts PM manifests with domain credentials to
manifests with credentials that apply only to a specific URL.

Usage:

${chalk.cyan(`${programName} [folder] | [<file(s)>]`)}

where:
    folder  - folder with the manifest files to process
    file(s) - manifest filenames to process

${chalk.gray(`Run this utility from the folder where the manifest files are
located. Alternatively, you can specify the folder where the
manifest files are located or filenames separated by space
character. Specify the folder name or file names, but not both.`)}

Version ${cfg.version}
`;
    console.log(msg);
}

export namespace notes {

    let messages: string[] = []; // messages will be shown if any warnings happen.
    let processed: string[] = []; // processed will be shown if ${programName} processed more then one folder.

    export function add(note: string): void {
        messages.push(note);
    }

    export function addProcessed(note: string): void {
        processed.push(note);
    }

    export function buildMessage(): string {
        let p = processed.length > 1 ? chalk.blueBright(`Processed:\n${processed.join('\n')}\n`) : '';
        let s = messages.length ? chalk.yellow(`\nNotes:\n${messages.join('\n')}\n`) : '';
        let f = `${p}${s}`;
        return f ? `${programName} finished\n\n${f}` : '';
    }

    export async function show(): Promise<void> {
        let final = buildMessage();
        if (final) {
            await exitProcess(0, final);
        }
    }
} //namespace notes

//TODO: options: replace files i.e. don't create backup folder (unique backup name w/ date)
//TODO: options: interactive mode
