import color from 'picocolors';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { help } from './app/app-help';
import { getAndCheckTargets } from './app/app-arguments';
import { executeTaskDc } from './app/task-dc';
import { notes } from './app/app-notes';

async function main() {
    const appArgs = await getAndCheckTargets();
    console.log('appArgs', appArgs);

    if (appArgs.dc) {
        executeTaskDc(appArgs.sourceGroups);
    } else if (appArgs.addPrefix || appArgs.removePrefix) {
        throw new Error('Not implemented yet');
    }

    notes.show();
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

//TODO: new CLI swithces: add and remove domain file prefix
