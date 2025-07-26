import { getAndCheckTargets, Notes } from '../8-app-env';
import { executeTaskDc } from '../2-task-domain-creds';
import { executeTaskRename } from '../3-task-rename';

export async function main() {
    const appArgs = await getAndCheckTargets();

    if (appArgs.dc) {
        executeTaskDc(appArgs.argsFolders);
    }
    else if (appArgs.addPrefix || appArgs.removePrefix) {
        executeTaskRename(appArgs.argsFolders, appArgs.addPrefix);
    }

    Notes.showAndExit();
}
