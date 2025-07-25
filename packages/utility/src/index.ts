import { color, exitProcess } from "./utils";
import { notes } from "./app/app-env/4-app-notes";
import { help } from "./app/app-env";
import { getAndCheckTargets } from "./app/app-env/1-get-verified-args";
import { executeTaskDc } from "./app/task-dc";
import { executeTaskRename } from "./app/task-rename";

async function main() {
    const appArgs = await getAndCheckTargets();

    if (appArgs.dc) {
        executeTaskDc(appArgs.rootGroups);
    } else if (appArgs.addPrefix || appArgs.removePrefix) {
        executeTaskRename(appArgs.rootGroups, appArgs.addPrefix);
    }

    notes.showAndExit();
}

main().catch(async (error) => {
    error.args && help();
    const msg = color[error.args ? 'yellow' : 'red'](error.message);
    const note = notes.buildMessage();
    await exitProcess(1, ['', msg, note].join('\n'));
});

//TODO: save manifests - done
//TODO: backup by date - done
//TODO: HTML report
//TODO: show diff

//TODO: new CLI swithces: add and remove domain file prefix - done

//TODO: add version to HID icon hover in the template project

//TODO: add slim scrollbar in the template project

//TODO: no-report; no-backup

//TODO: what to do if no folders; use current? - done

//TODO: promt process after operation selected:
//  dc: folder, domain
//  add prefix: folders, file, domain
//  remove prefix: folders, file, domain

//TODO: --d donain to +/- as prefix - done

//TODO: interactive mode during operation process started like 'let me select'

//TODO: interactive mode by domains
//TODO: ask do adv options

//task-dc:
    //TODO: place modified files into original folder - will not do

//task-rename-files:
    //throw new Error('Not implemented yet');
    //TODO: ___mm_: ___cx_ ___cc_ ___ix_ ___mx_
    //TODO: remove any filename prefixes not only ours: for add-prefix and remove-prefix; remove-existing
    //TODO: interactive mode
    
    //TODO: '--remove-prefix' with '--remove-any' option may need to have backup as separate folder with a single html file
