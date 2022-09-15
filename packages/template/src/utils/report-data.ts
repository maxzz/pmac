import { ItemDuplicate, ItemInputFile, Report, ReportRecords } from '@pmac/shared-types';
import { reports } from './test-data';
import { splitByKey } from './utils';

function getInputs(report: Report): Record<string, ItemInputFile> {
    const inputs = report.inputs?.input?.reduce<Record<string, ItemInputFile>>((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});
    return inputs || {};
}

export type InputSameDcItem = {
    dup: ItemDuplicate;
    src: ItemInputFile;
    open?: boolean;
};

export type FolderInputSameDcItem = {
    root: string;
    dcs: InputSameDcItem[];
};

function getSameDc(report: Report): InputSameDcItem[] {
    const inputs = getInputs(report);
    return report.domcreds?.multiple?.map((item) => ({ dup: item, src: inputs[item.id], } as InputSameDcItem)) || [];
}

export function folderInputSameDcItem(reportRecords: ReportRecords): FolderInputSameDcItem[] {
    return reportRecords.map((report) => {
        const sameDcItems = getSameDc(report);
        return {
            root: report.root,
            dcs: sameDcItems,
        };
    });
}

export namespace ReportData {
    export const reportData = reports;

    export const folderInputSameDcItems: FolderInputSameDcItem[] = folderInputSameDcItem(reports);
}
