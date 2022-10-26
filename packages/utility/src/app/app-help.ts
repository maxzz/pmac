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
      -c, --dc            - switch domain credentials to credentials
                            that apply only to a specific URL
      -a, --add-prefix    - add domain name as prefix to manifest filenames
      -r, --remove-prefix - remove domain name prefix from manifest filenames
      -h, --help          - show full help

    options:
      --domain            - process manifests only with the specified web domain.`;
    return msg;
}

export function helpExamples() {
    let msg = `
examples
    ${color.gray('pmac --dc c:/manifests')}
        This command looks in the "c:/manifests" folder and updates the
        manifest mapping settings from domain credentials to credentials 
        that only apply to a specific URL. As a result, Password Manager 
        will not prompt you to select credentials from a menu.

    ${color.gray('pmac --dc --domain mybank.com c:/manifests')}
        This is the same as the previous example, but the changes will only
        apply to manifest files with the mybank.com domain.

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
      --backup            - create backup of modified files (defautl yes).
      --report            - create report file (defautl yes).
      --update            - update manifest files (defautl yes).`;
    return msg;
}

export function help(showAdvanced: boolean = false) {
    let msg = `${helpHeader()}${showAdvanced ? `\n${helpAdvancedOption()}\n${helpExamples()}` : ''}`;
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

/* spelling checked:
DC is an irreversible operation compared to prefix add/remove operations.
To preserve the ability to rollback DC changes, the program will create a backup folder with changed files.
This backup folder will be in the same folder as the manifest files, but will have a unique name each time the utility is run.
The name of this backup folder looks like "backup-10.25.22-at-15.26.39.195" where the "10.25.22" part is the date and "15.26.39.195" is the start time.
*/

//TODO: options: replace files i.e. don't create backup folder (unique backup name w/ date)
//TODO: options: interactive mode

export type MinimistArgs = {
    'dc': boolean;
    'add-prefix': boolean;
    'remove-prefix': boolean;
    'help': boolean;
    'backup': boolean;
    'report': boolean;
    'update': boolean;
    'c': boolean;
    'a': boolean;
    'r': boolean;
    'h': boolean;
    'domain': string;
    _: string[];
};

export function getMinimistArgs(): MinimistArgs {
    let args: MinimistArgs = minimist<MinimistArgs>(process.argv.slice(2), {
        boolean: ['dc', 'add-prefix', 'remove-prefix', 'help', 'backup', 'report', 'update',],
        string: ['domain'],
        alias: {
            'c': 'dc',
            'a': 'add-prefix',
            'r': 'remove-prefix',
            'h': 'help',
        },
        
    });
    return args;
}
