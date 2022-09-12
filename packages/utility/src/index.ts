import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { help } from './utils/app-help';
import { getAndCheckTargets, getVerifiedFolders, SourceGroup, Targets } from './utils/app-arguments';
import { step_SetDcActive, step_LoadManifests, step_MakeBackupCopy, step_MakeReport, step_ModifyDuplicates } from './utils/app-steps';
import { notes } from './utils/app-notes';

function processFiles(sourceGroup: SourceGroup) {
    const targetGroup = step_LoadManifests(sourceGroup);
    step_SetDcActive(targetGroup);
    if (!targetGroup.dcActive.length) {
        return;
    }

    step_MakeBackupCopy(targetGroup);
    step_ModifyDuplicates(targetGroup);
    step_MakeReport(targetGroup);
}

async function main() {
    let targets: Targets = getAndCheckTargets();
    const sourceGroups = getVerifiedFolders(targets);

    for (let sourceGroup of sourceGroups) {
        processFiles(sourceGroup);
    }

    notes.show();
}

main().catch(async (error) => {
    error.args && help();
    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});

//TODO: save manifests - done
//TODO: backup by date - done
//TODO: HTML report
//TODO: show diff
