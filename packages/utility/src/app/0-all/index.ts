import { getAndCheckTargets, Notes } from './../app-env';
import { executeTaskDc } from './../task-domain-creds';
import { executeTaskRename } from './../task-rename';

export async function main() {
    const appArgs = await getAndCheckTargets();

    if (appArgs.dc) {
        executeTaskDc(appArgs.rootGroups);
    }
    else if (appArgs.addPrefix || appArgs.removePrefix) {
        executeTaskRename(appArgs.rootGroups, appArgs.addPrefix);
    }

    Notes.showAndExit();
}
