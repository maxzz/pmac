import { color, exitProcess } from './utils';
import { notes } from './app/app-notes';
import { help } from './app/app-help';
import { getAndCheckTargets } from './app/app-arguments';
import { executeTaskDc } from './app/task-dc';

async function main() {
    const appArgs = await getAndCheckTargets();

    if (appArgs.dc) {
        executeTaskDc(appArgs.rootGroups);
    } else if (appArgs.addPrefix || appArgs.removePrefix) {
        throw new Error('Not implemented yet');
    }

    notes.showAndExit();
}

main().catch(async (error) => {
    error.args && help();
    const msg = color[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
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
