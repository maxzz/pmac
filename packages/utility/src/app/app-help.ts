import color from "picocolors";
import minimist from 'minimist';
let config = require('../../../../package.json');

export const programName = config.name; //config.name.split('/')[0].substring(1);
export const programVersion = config.version;

export function help() {

    let msg = `
The ${color.cyan(`${programName}`)} (password manager administrator commands) utility version ${programVersion}.

Usage: ${color.cyan(`${programName} source [options]`)}

where:
    source       - folder with the manifest files to process or
                   space-separated list of manifest filenames to process
    options:
        --domain - process manifests only with the specified web domain.
                   For example pmac --domain google.com

The ${color.cyan(`${programName}`)} utility converts PM manifests with domain credentials to
manifests with credentials that apply only to a specific URL.
        
${color.gray(`Run this utility from the folder where the manifest files are
located. Alternatively, you can specify the folder where the
manifest files are located or filenames separated by space
character. Specify the folder name or file names, but not both.`)}

Version ${programVersion}`;

    console.log(msg);
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
