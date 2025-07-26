import minimist from "minimist";

export function getMinimistArgs(): MinimistArgs {
    let args: MinimistArgs = minimist<MinimistArgs>(process.argv.slice(2), {
        boolean: ['dc', 'add-prefix', 'remove-prefix', 'help', 'need-backup', 'need-report', 'need-update', 'remove-any', 'generate-json',],
        string: ['domain'],
        alias: {
            'c': 'dc',
            'a': 'add-prefix',
            'r': 'remove-prefix',
            'h': 'help',
        },
        default: {
            'need-backup': 0, // hack: number instead of undefined to distinguish uninitialized values.
            'need-report': 0,
            'need-update': 0,
            'remove-any': 0,
        },
    });
    return args;
}

type MinimistArgs = {
    'dc': boolean;
    'add-prefix': boolean;
    'remove-prefix': boolean;
    'help': boolean;
    'need-backup': boolean;
    'need-report': boolean;
    'need-update': boolean;
    'remove-any': boolean;
    'generate-json': boolean; // private: generate local json file for template debugging
    'c': boolean;
    'a': boolean;
    'r': boolean;
    'h': boolean;
    'domain': string;
    _: string[];
};

/*
(*) this will not modify content of manifest files, just change filenames as result there is no backup files.
(**) this will modify content of manifest files, as result backup files will be created.
*/

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
