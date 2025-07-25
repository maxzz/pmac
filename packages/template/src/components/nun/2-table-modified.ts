import { type ItemInputFile, type ReportRecords } from "@pmac/shared-types";
import { type FolderInputSameDcItem, type InputSameDcItem, ReportData } from "../../test-data";
import { splitByKey } from "../../utils/utils";
import { H1 } from "./8-components";

export function TableModified(reportRecords: ReportRecords) {
    const Folders = ReportData.folderInputSameDcItems.map(
        (folder) => Folder({ sameDcs: folder })
    ).join('');

    return (`
        ${H1({ text: "Modified manifest files" })}
        <div class="mx-4 mb-12">
            <div class="ml-4 text-sm">
                ${Folders}
            </div>
        </div>
    `);
}

function Folder({ sameDcs }: { sameDcs: FolderInputSameDcItem; }) {
    const byDomains = Object.entries(splitByKey(sameDcs.dcs, (item) => item.src.urls[0]?.domain));
    return byDomains.map(
        ([domain, dcs]) => {
            return `
        ${H1({ text: `Folder ${sameDcs.root}` })}
        ${Domain({ domain, items: dcs })}
        `;
        }
    ).join('');
}

function Domain({ domain, items }: { domain: string; items: InputSameDcItem[]; }) {
    const manis = items.map(
        (item) => Mani({ item })
    ).join('');
    return `
        <div class="">${domain}</div>
        <div class="ml-4 flex flex-col space-y-4">${manis}</div>
    `;
}

function Mani({ item }: { item: InputSameDcItem; }) {
    return `
        <div>
            <div class="bg-[#a4c9ee] rounded shadow">
                ${ManiTitle({ file: item.src })}

                <div class="ml-4">
                    ${ManiForm({ item, idx: 0 })}
                    ${ManiForm({ item, idx: 1 })}
                </div>
            </div>
        </div>
    `;

    function ManiTitle({ file }: { file: ItemInputFile; }) {
        return `
        <div class="px-2 py-2 bg-[#4592dc80] grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
            <div>Manifet name:</div> <div class="">${file.title}</div>
            <div>Manifet filename:</div> <div class="">${file.short}</div>
        </div>
    `;
    }

    function ManiForm({ item, idx }: { item: InputSameDcItem, idx: number; }) {
        const formName = !idx ? 'Login' : 'Password change';
        const org = item.src?.urls?.[idx]?.ourl || '';
        const mod = item.dup?.urls?.[idx] || '';
        if (!org && !mod) { return ''; }
        return `
        <div class="py-2 text-xs">
            <div class="">${formName}</div>
            <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
                <div class="text-xs">Prev URL:</div> <div class="text-red-700">${org}</div>
                <div class="text-xs">New URL:</div> <div class="text-green-700">${mod}</div>
            </div>
        </div>
    `;
    }
}

function NNN({ idx }: { idx: number; }) {
    return `
    `;
}
