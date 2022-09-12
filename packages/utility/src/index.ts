import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { help } from './utils/app-help';
import { getAndCheckTargets, getVerifiedFolders, SourceGroup, Targets } from './utils/app-arguments';
import { step_FindSameDc, step_LoadManifests, step_FinalMakeReport, TargetGroup, step_SaveResult } from './utils/app-steps';
import { notes } from './utils/app-notes';

function processFiles(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = step_LoadManifests(sourceGroup);
    step_FindSameDc(targetGroup);
    step_SaveResult(targetGroup);
    return targetGroup;
}

async function main() {
    let targets: Targets = getAndCheckTargets();
    const sourceGroups = getVerifiedFolders(targets);
    step_FinalMakeReport(sourceGroups.map(processFiles));
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
