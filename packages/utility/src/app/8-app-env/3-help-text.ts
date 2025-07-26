import { color } from "../../utils";

let config = require("../../../../../package.json");

export const programName = config.name; //config.name.split('/')[0].substring(1);
export const programVersion = config.version;

export function help(showAdvanced: boolean = false) {
    const msg = `${helpMainBody()}${showAdvanced ? `\n${helpAdvancedOption()}\n${helpExamples()}` : ''}`;
    console.log(msg);
}

function helpMainBody() {
    let msg = `
The ${color.gray(`${programName}`)} (password manager administrator commands) utility version ${programVersion}.

Usage: ${color.gray(`${programName} source [command] [options]`)}

where:
    source                - Folder with the manifest files to process or
                            space-separated list of manifest filenames to process.
    command:
      -c, --dc            - Switch domain credentials to credentials
                            that apply only to a specific URL. This command will
                            back up changed files.
      -a, --add-prefix    - Add domain name as prefix to manifest filenames.
      -r, --remove-prefix - Remove domain name prefix from manifest filenames.
      -h, --help          - Output usage information.

    options:
      --domain            - Process manifests only with the specified web domain.`;
    return msg;
}

function helpAdvancedOption() {
    let msg = `
    advanced options:
      --need-backup       - Create backup of modified files (defautl yes).
      --need-report       - Create report file (defautl yes).
      --need-update       - Update manifest files (defautl yes).
      --remove-any        - Remove any existing prefixes before the guid part
                            of the filename when running the --remove-prefix
                            command (default no)`;
    return msg;
}

function helpExamples() {
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

    ${color.gray('pmac --dc --domain mybank.com c:/manifests --no-need-report')}
        This is the same as the previous example, but the program will not
        generate a report.

    ${color.gray('pmac --add-prefix --domain mybank.com c:/manifests')}
        This command will look in the "c:/manifests" folder and will rename
        manifests with the "mybank.com" domain to "mybank.com.{guid}.dpm".

    ${color.gray('pmac --remove-prefix --domain mybank.com c:/manifests')}
        This command will look in the "c:/manifests" folder and will rename
        manifests file names "mybank.com.{guid}.dpm" to "{guid}.dpm".`;
    return msg;
}
