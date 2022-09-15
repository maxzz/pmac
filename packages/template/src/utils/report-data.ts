import { ItemDuplicate, ItemInputFile, Report, ReportRecords } from '@pmac/shared-types';
import { reports as rawRepopts } from './test-data';
import { splitByKey } from './utils';

function getInputs(report: Report): Record<string, ItemInputFile> {
    const inputs = report.inputs?.input?.reduce<Record<string, ItemInputFile>>((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});
    return inputs || {};
}

export type InputSameDcItem = {
    dup?: ItemDuplicate;
    src: ItemInputFile;
};

export type FolderInputSameDcItem = {
    root: string;
    dcs: InputSameDcItem[];
};

function getSameDc(report: Report): InputSameDcItem[] {
    const inputs = getInputs(report);
    return report.domcreds?.multiple?.map((item) => ({ dup: item, src: inputs[item.id], } as InputSameDcItem)) || [];
}

function folderInputSameDcItem(reportRecords: ReportRecords): FolderInputSameDcItem[] {
    return reportRecords.map((report) => {
        const sameDcItems = getSameDc(report);
        return {
            root: report.root,
            dcs: sameDcItems,
        };
    });
}

function getAllInputItems(reportRecords: ReportRecords): Record<string, ItemInputFile> {
    const rv: Record<string, ItemInputFile> = {};
    const items = reportRecords.map((report) => {
        report.inputs?.input?.forEach((item) => rv[item.id] = item);
    });
    return rv;
}

function getAllDcsItems(reportRecords: ReportRecords): Record<string, ItemDuplicate> {
    const rv: Record<string, ItemDuplicate> = {};
    const items = reportRecords.map((report) => {
        report.domcreds?.multiple?.forEach((item) => rv[item.id] = item);
    });
    return rv;
}

function getAllById(): Record<string, InputSameDcItem> {
    const allInputs = getAllInputItems(rawRepopts);
    const allDcs = getAllDcsItems(rawRepopts);
    return Object.fromEntries(Object.entries(allInputs).map(([id, item]) => [id, { src: item, dup: allDcs[id] }]));
}

export namespace ReportData {
    export const reportData = rawRepopts;

    export const folderInputSameDcItems: FolderInputSameDcItem[] = folderInputSameDcItem(rawRepopts);

    export const allItemsById: Record<string, InputSameDcItem> = getAllById();
}
