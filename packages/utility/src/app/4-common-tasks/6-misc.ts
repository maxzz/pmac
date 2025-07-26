import { type ItemError } from "@pmac/shared-types";
import { type AppOptions, type FileMeta, type SameDomainCreds, type SingleFolder } from "../9-types";
import { Notes } from "../8-app-env";

// Flat manifest

export function flatDomainCredsActive(sameDC: SameDomainCreds[]): FileMeta[] {
    const files: FileMeta[] = sameDC.map(
        ({ domain, files }) => files
    ).flat();
    return files;
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
