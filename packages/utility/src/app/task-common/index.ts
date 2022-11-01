import { ItemError } from '@pmac/shared-types';
import { AppOptions, FileMeta, SameDc, TargetGroup } from '../../app-types';
import { notes } from '../app-env';

export { step1_LoadManifests } from './load-files';
export { printDcActive, printLoaded } from './print-groups';

// Flat manifest

export function flatDcActive(sameDC: SameDc[]): FileMeta[] {
    const files: FileMeta[] = sameDC.map(({ domain, files }) => files).flat();
    return files;
}

// Errors

export function addError(targetGroup: TargetGroup, msg: ItemError | string) {
    const errors = targetGroup.report.errors || (targetGroup.report.errors = []);
    errors.push(typeof msg === 'string' ? { text: msg } : msg);
}

// Notes

export function addNoteIfEmptyAfterFilter(targetGroup: TargetGroup, filteredOut: FileMeta[], appOptions: AppOptions) {
    const gotEmptySet = !filteredOut.length && targetGroup.files.length && appOptions.domain;
    if (gotEmptySet) {
        notes.addProcessed(`No manifests after applying "${appOptions.domain}" filter.`)
    }
}
