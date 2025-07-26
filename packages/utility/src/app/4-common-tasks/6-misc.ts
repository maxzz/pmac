import { type ItemError } from "@pmac/shared-types";
import { type AppOptions, type FileCnt, type DuplFileCnts, type SingleFolder } from "../9-types";
import { Notes } from "../8-app-env";

// Flat manifest

export function duplFileCntsToFileCnts(sameDC: DuplFileCnts[]): FileCnt[] {
    const fileCnt: FileCnt[] = sameDC.map(
        ({ domain, fileCnts }) => fileCnts
    ).flat();
    return fileCnt;
}

// Errors

export function addError(singleFolder: SingleFolder, msg: ItemError | string) {
    const errors = singleFolder.report.errors || (singleFolder.report.errors = []);
    errors.push(typeof msg === 'string' ? { text: msg } : msg);
}

// Notes

export function addNoteIfEmptyAfterFilter(prefix: string, appOptions: AppOptions) {
    Notes.addProcessed(`${prefix}No manifests found matching the filter "${appOptions.domain}".`);
}
