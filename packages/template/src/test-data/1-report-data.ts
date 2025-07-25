import { type ItemDuplicate, type ItemInputFile, type Report, type ReportRecords } from "@pmac/shared-types";
import { reports as rawRepopts } from "./2-test-data";
import { splitByKey } from "../utils/utils";

export type InputSameDcItem = {
    dup?: ItemDuplicate;
    src: ItemInputFile;
};

export type FolderInputSameDcItem = {
    root: string;
    dcs: InputSameDcItem[];
};

export namespace ReportData {
    const firstReport = rawRepopts?.[0];
    export const reportVersion = firstReport ? { version: firstReport.version, date: firstReport.date } : undefined;

    export const folderInputSameDcItems: FolderInputSameDcItem[] = folderInputSameDcItem(rawRepopts);

    type ItemId = string;

    function getAllInputItems(reportRecords: ReportRecords): Record<ItemId, ItemInputFile> {
        const rv: Record<ItemId, ItemInputFile> = {};
        const items = reportRecords.map(
            (report) => {
                report.inputs?.input?.forEach((item) => rv[item.id] = item);
            }
        );
        return rv;
    }

    function getAllDcsItems(reportRecords: ReportRecords): Record<ItemId, ItemDuplicate> {
        const rv: Record<ItemId, ItemDuplicate> = {};
        const items = reportRecords.map(
            (report) => {
                report.domcreds?.multiple?.forEach((item) => rv[item.id] = item);
            }
        );
        return rv;
    }

    function getAllById(): Record<ItemId, InputSameDcItem> {
        const allInputs = getAllInputItems(rawRepopts);
        const allDcs = getAllDcsItems(rawRepopts);
        const rv = Object.fromEntries(Object.entries(allInputs).map(
            ([id, item]) => [id, { src: item, dup: allDcs[id] }]
        ));
        return rv;
    }

    export const allItemsById: Record<ItemId, InputSameDcItem> = getAllById();

    export function getUrlsToShow(item: InputSameDcItem, idx: number): { org: string; mod: string; } {
        const org = item.src?.urls?.[idx]?.ourl || '';
        const mod = item.dup?.urls?.[idx] || '';
        return { org, mod };
    }

} //namespace ReportData

function folderInputSameDcItem(reportRecords: ReportRecords): FolderInputSameDcItem[] {
    const rv = reportRecords.map(
        (report) => {
            const sameDcItems = getSameDc(report);
            return {
                root: report.root,
                dcs: sameDcItems,
            };
        }
    );
    return rv;
}

function getSameDc(report: Report): InputSameDcItem[] {
    const inputs = getInputs(report);
    const rv = report.domcreds?.multiple?.map(
        (item) => ({ dup: item, src: inputs[item.id], } as InputSameDcItem)
    ) || [];
    return rv;
}

function getInputs(report: Report): Record<string, ItemInputFile> {
    const inputs = report.inputs?.input?.reduce<Record<string, ItemInputFile>>((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});
    return inputs || {};
}

//TODO: break dependency on folderInputSameDcItem() call that will call getInputs() and set IDs.
