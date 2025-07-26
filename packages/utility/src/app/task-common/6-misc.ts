import { type ItemError } from "@pmac/shared-types";
import { type AppOptions, type FileMeta, type SameDomainCreds, type TargetGroup } from "../9-types";
import { Notes } from "../app-env";

// Flat manifest

export function flatDomainCredsActive(sameDC: SameDomainCreds[]): FileMeta[] {
    const files: FileMeta[] = sameDC.map(
        ({ domain, files }) => files
    ).flat();
    return files;
}

// Errors

export function addError(targetGroup: TargetGroup, msg: ItemError | string) {
    const errors = targetGroup.report.errors || (targetGroup.report.errors = []);
    errors.push(typeof msg === 'string' ? { text: msg } : msg);
}

// Notes

export function addNoteIfEmptyAfterFilter(prefix: string, appOptions: AppOptions) {
    Notes.addProcessed(`${prefix}No manifests found matching the filter "${appOptions.domain}".`);
}
