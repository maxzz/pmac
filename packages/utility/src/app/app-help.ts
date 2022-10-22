import color from "picocolors";
import minimist from 'minimist';
let config = require('../../../../package.json');

export const programName = config.name; //config.name.split('/')[0].substring(1);
export const programVersion = config.version;

export function help() {

    let msg = `
The ${color.cyan(`${programName}`)} utility converts PM manifests with domain credentials to
manifests with credentials that apply only to a specific URL.

Usage:

${color.cyan(`${programName} [folder] | [<file(s)>]`)}

where:
    folder  - folder with the manifest files to process
    file(s) - manifest filenames to process

${color.gray(`Run this utility from the folder where the manifest files are
located. Alternatively, you can specify the folder where the
manifest files are located or filenames separated by space
character. Specify the folder name or file names, but not both.`)}

Version ${programVersion}`;

    console.log(msg);
    
    // console.log(color.cyan(`Processed2:`));
    // console.log(color.dim(color.cyan(`Processed2:`)));
    // console.log(color.dim(color.blue(`Processed2:`)));
    // console.log(color.blue(color.dim(`Processed2:`)));
    // console.log(color.dim(`Processed3:`));
    // console.log(color.bold(`Processed3:`));
    // console.log(`Processed3:`);
    // console.log(color.blue(`Processed:`));
}

//TODO: options: replace files i.e. don't create backup folder (unique backup name w/ date)
//TODO: options: interactive mode

export type MinimistArgs = {
    'dc': boolean;
    'add-prefix': boolean;
    'remove-prefix': boolean;
    'd': boolean;
    'a': boolean;
    'r': boolean;
    _: string[];
};

export function getMinimistArgs(): MinimistArgs {
    let args: MinimistArgs = minimist<MinimistArgs>(process.argv.slice(2), {
        boolean: ['dc', 'add-prefix', 'remove-prefix'],
        alias: {
            'd': 'dc',
            'a': 'add-prefix',
            'r': 'remove-prefix',
        },
    });
    return args;
}
