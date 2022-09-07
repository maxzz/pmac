import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { help } from './utils/app-help';
import { getAndCheckTargets, getVerifiedFolders, TargetGroup, Targets } from './utils/app-arguments';
import { step_GetDuplicates, step_LoadManifests, step_MakeBackupCopy, step_MakeReport, step_ModifyDuplicates } from './utils/app-steps';
import { notes } from './utils/app-notes';

function processFiles(targetGroup: TargetGroup) {

    const loadedManifests = step_LoadManifests(targetGroup);
    const duplicates = step_GetDuplicates(loadedManifests.files);
    if (!duplicates) {
        return;
    }

    step_MakeBackupCopy(duplicates, targetGroup.root);
    step_ModifyDuplicates(duplicates);
    step_MakeReport(duplicates, targetGroup.root);
}

async function main() {
    let targets: Targets = getAndCheckTargets();

    const filesByFolders = getVerifiedFolders(targets);

    for (let targetGroup of filesByFolders) {
        processFiles(targetGroup);
    }

    notes.show();
}

main().catch(async (error) => {
    error.args && help();
    const msg = chalk[error.args ? 'yellow' : 'red'](`\n${error.message}`);
    await exitProcess(1, `${notes.buildMessage()}${msg}`);
});

//TODO: save manifests - done
//TODO: backup by date
//TODO: HTML report
//TODO: show diff
