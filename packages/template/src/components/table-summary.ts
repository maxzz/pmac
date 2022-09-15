import { ItemInputFile } from "@pmac/shared-types";
import { folderInputSameDcItem, InputSameDcItem, reportData } from "../utils/report-data";

function ManiForm({ item, idx }: { item: InputSameDcItem, idx: number; }) {
    const formName = !idx ? 'Login' : 'Password change';
    const org = item.src?.urls?.[idx]?.ourl || '';
    const mod = item.dup.urls?.[idx] || '';
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

function ManiTitle({ file }: { file: ItemInputFile; }) {
    return `
        <div class="px-2 py-2 bg-[#4592dc80] grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
            <div>Manifet name:</div> <div class="">${file.title}</div>
            <div>Manifet filename:</div> <div class="">${file.short}</div>
        </div>
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
}

export function createTable(parent: HTMLElement) {
    const sameDcItems = folderInputSameDcItem(reportData);
    const flatItems = sameDcItems.map(({root, dcs}) => dcs).flat();

    const fragment = document.createDocumentFragment();

    const rootEl = document.createElement('div');

    const itemsText = flatItems.map((item) => Mani({item})).join('');

    rootEl.innerHTML = `
        ${itemsText}
        <div>login-name</div>
        <div>modified-text</div>

        <div class="info-toggle" data-id="777">folder</div>
        <div>filename</div>
    `;

    fragment.append(rootEl);

    [...fragment.querySelectorAll<HTMLElement>('.info-toggle')].forEach((el) => {
        el.addEventListener('click', () => {
            console.log('el', el, el.dataset.id);
        })
    })

    parent.append(fragment);
}
