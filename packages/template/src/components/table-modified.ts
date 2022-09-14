import { ItemInputFile, ReportRecords, Report_InputFiles } from "@pmac/shared-types";
import { FolderInputSameDcItem, folderInputSameDcItem, InputSameDcItem, splitByDomains } from "../utils/report-data";
import { H1 } from "./components";

function HeaderRow({ col1, col2 }: { col1: string, col2: string; }) {
    return (`
    <div class="my-px px-2 text-xs rounded-tl">${col1}</div>
    <div class="border-transparent border"></div>
    <div class="my-px px-2 text-xs rounded-tr">${col2}</div>
    `);
}

function Row({ col1, col2, isFirst, isLast }: { col1: string, col2: string, isFirst: boolean, isLast: boolean; }) {
    return (`
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tl' : isLast ? 'rounded-bl' : ''}">${col1}</div>
    <div class="border-transparent border"></div>
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tr' : isLast ? 'rounded-br' : ''}">${col2}</div>
    `);
}

function TableRow(input: ItemInputFile, isFirst: boolean, isLast: boolean) {
    return Row({ col1: input.title || 'No login title', col2: input.short, isFirst, isLast });
}

function ManiForm({ idx }: { idx: number; }) {
    const name = !idx ? 'Login' : 'Password change';
    return `
        <div class="ml-4">
            Form ${name}
            <div class="ml-4">
                Old URL
            </div>
            <div class="ml-4">
                New URL
            </div>
        </div>
    `;
}

function NNN({ idx }: { idx: number; }) {
    return `
    `;
}

function ManiTitle({ file }: { file: ItemInputFile; }) {
    return `
        <div class="ml-8">
            ${file.title}
        </div>
        <div class="ml-8">
            ${file.short}
        </div>
    `;
}

function Mani({ item }: { item: InputSameDcItem; }) {
    return `
        <div>
            <div class="">Manifest</div>
            <div class="border-primary-700 border rounded bg-red-500">
                ${ManiTitle({file: item.src})}

                <div class="ml-4">
                    ${ManiForm({ idx: 0 })}
                    ${ManiForm({ idx: 1 })}
                </div>
            </div>
        </div>
    `;
}

function Domain({ domain, items }: { domain: string; items: InputSameDcItem[]; }) {
    const manis = items.map((item) => Mani({ item })).join('');
    return `
        <div class="">${domain}</div>
        <div class="ml-4 flex flex-col space-y-4">${manis}</div>
    `;
}

function Folder({ sameDcs }: { sameDcs: FolderInputSameDcItem; }) {
    const byDomains = Object.entries(splitByDomains(sameDcs.dcs));
    return byDomains.map(([domain, dcs]) => {
        return `
        ${H1({ text: `Folder ${sameDcs.root}` })}
        ${Domain({ domain, items: dcs })}
        `;
    }).join('');
}

export function TableModified(reportRecords: ReportRecords) {
    const sameDcs = folderInputSameDcItem(reportRecords);
    const Folders = sameDcs.map((folder) => Folder({ sameDcs: folder })).join('');
    return (`
        ${H1({ text: "Modified manifest files" })}
        <div class="">
            <div class="ml-4">
                ${Folders}
            </div>
        </div>
    `);
}
