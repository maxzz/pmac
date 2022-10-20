import chalk from 'chalk';
import rimraf from 'rimraf';
import { exitProcess } from './utils/utils-errors';
import { SourceGroup } from './app/app-types';
import { help } from './app/app-help';
import { getAndCheckTargets } from './app/app-arguments';
import { step2_FindSameDc, step1_LoadManifests, step4_FinalMakeReport, TargetGroup, step3_SaveResult } from './app/app-steps';
import { notes } from './app/app-notes';

function processSourceGroup(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = step1_LoadManifests(sourceGroup);
    step2_FindSameDc(targetGroup);
    step3_SaveResult(targetGroup);
    return targetGroup;
}

async function main() {
    const appArgs = await getAndCheckTargets();
    console.log('appArgs', appArgs);

    if (appArgs.dc) {
        const targetGroups = appArgs.sourceGroups.map(processSourceGroup);
        //step4_FinalMakeReport(targetGroups);
    } else if (appArgs.addPrefix || appArgs.removePrefix) {
        throw new Error('Not implemented yet');
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

//TODO: new CLI swithces: add and remove domain file prefix
