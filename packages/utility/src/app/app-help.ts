import color from "picocolors";
import minimist from 'minimist';
let config = require('../../../../package.json');

export const programName = config.name; //config.name.split('/')[0].substring(1);
export const programVersion = config.version;

export const strDoneNothing = 'Nothing has been done';
export const strDoNothingExit = 'Chosen to do nothing, just exit.';

export function helpHeader() {
    let msg = `
The ${color.gray(`${programName}`)} (password manager administrator commands) utility version ${programVersion}.

Usage: ${color.gray(`${programName} source [command] [options]`)}

where:
    source                - folder with the manifest files to process or
                            space-separated list of manifest filenames to process
    command:
      --dc, -c            - switch domain credentials to credentials
                            that apply only to a specific URL
      --add-prefix, -a    - add domain name as prefix to manifest filenames
      --remove-prefix, -r - remove domain name prefix from manifest filenames
      --help              - show full help

    options:
      --domain            - process manifests only with the specified web domain.`;
    return msg;
}

export function helpExamples() {
    let msg = `
examples
    ${color.gray('pmac --add-prefix --domain mybank.com c:/manifests')}
        This command will look in the "c:/manifests" folder and will rename
        manifests with the "mybank.com" domain to "mybank.com.{guid}.dpm".

    ${color.gray('pmac --remove-prefix --domain mybank.com c:/manifests')}
        This command will look in the "c:/manifests" folder and will rename
        manifests file names "mybank.com.{guid}.dpm" to "{guid}.dpm".`;
    return msg;
}

export function helpAdvancedOption() {
    let msg = `
    advanced options:
      --no-backup         - don't create back up for modified files.
      --no-report         - don't create report file.
      --no-update         - don't update manifest files.`;

    return msg;
}

export function help(showAdvanced: boolean = false) {
    let msg = `${helpHeader()}\n${showAdvanced ? `${helpAdvancedOption()}\n` : ''}${helpExamples()}`;
    console.log(msg);
}

/*

For example ${color.gray('pmac --domain google.com')}

examples

    ${color.gray('pmac --add-prefix --domain mybank.com c:/manifests')}

        --add-prefix is commnad
        --domain mybank.com is option
        c:/manifests is source

        This command will look in the "c:/manifests" folder and will rename
        manifests with the "mybank.com" domain to "mybank.com.{guid}.dpm".


The ${color.cyan(`${programName}`)} utility converts PM manifests with domain credentials to
manifests with credentials that apply only to a specific URL.

${color.gray(`Run this utility from the folder where the manifest files are
located. Alternatively, you can specify the folder where the
manifest files are located or filenames separated by space
character. Specify the folder name or file names, but not both.`)}
*/

//TODO: options: replace files i.e. don't create backup folder (unique backup name w/ date)
//TODO: options: interactive mode

export type MinimistArgs = {
    'dc': boolean;
    'add-prefix': boolean;
    'remove-prefix': boolean;
    'help': boolean;
    'no-backup': boolean;
    'no-report': boolean;
    'no-update': boolean;
    'c': boolean;
    'a': boolean;
    'r': boolean;
    'domain': string;
    _: string[];
};

export function getMinimistArgs(): MinimistArgs {
    let args: MinimistArgs = minimist<MinimistArgs>(process.argv.slice(2), {
        boolean: ['dc', 'add-prefix', 'remove-prefix', 'help', 'no-backup', 'no-report', 'no-update',],
        string: ['domain'],
        alias: {
            'c': 'dc',
            'a': 'add-prefix',
            'r': 'remove-prefix',
        },
    });
    return args;
}
