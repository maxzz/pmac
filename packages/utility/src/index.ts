import { main } from './app/0-all';
import { help, Notes } from './app/8-app-env';
import { color, exitProcess } from './utils';

main().catch(async (error) => {
    error.args && help();

    const msg = color[error.args ? 'yellow' : 'red'](error.message);
    const note = Notes.buildMessage();
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
