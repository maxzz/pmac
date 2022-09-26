import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { help } from './app/app-help';
import { getAndCheckTargets, getVerifiedFolders, SourceGroup, Targets } from './app/app-arguments';
import { step2_FindSameDc, step1_LoadManifests, step_FinalMakeReport, TargetGroup, step3_SaveResult } from './app/app-steps';
import { notes } from './app/app-notes';

function processFiles(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(sourceGroup);
    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);
    return targetGroup;
}

async function main() {
    let targets: Targets = getAndCheckTargets();
    const sourceGroups = getVerifiedFolders(targets);
    const targetGroups = sourceGroups.map(processFiles);
    step_FinalMakeReport(targetGroups);
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

//TODO: new CLI swithces: add and remove domain file prefix
