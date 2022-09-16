import { InputSameDcItem, ReportData } from "../utils/report-data";



function IconArrow(right: boolean) {
    const righrOrDown = right ? 'M 50 13 L 80 43 L 50 72' : 'M 80 35 L 50 65 L 20 35';
    return `
    <svg class="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-transparent" viewBox="0 0 100 100"><path d="${righrOrDown}"></path></svg>
    `
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

function Mani({ item }: { item: InputSameDcItem; }) {
    return `
    <div class="info-toggle flex items-center cursor-pointer" data-id="${item.src.id}">
        <div class="flex-none">${IconArrow(true)}</div>
        <div class="">${item.src.title}</div>
    </div>
    
    <div class="info-toggle my-px border-primary-400 border rounded select-none cursor-pointer" data-id="${item.src.id}">Updated</div>
    `;
}

export function createTable(parent: HTMLElement) {
    const sameDcItems = ReportData.folderInputSameDcItems;
    const flatItems = sameDcItems.map(({ root, dcs }) => dcs).flat();

    const itemsText = `
        <div class="max-w-xl px-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2">
        ${flatItems.map((item) => Mani({ item })).join('')}
        </div>
    `;

    const fragment = document.createDocumentFragment();
    const rootEl = document.createElement('div');
    rootEl.innerHTML = itemsText;
    fragment.append(rootEl);

    [...fragment.querySelectorAll<HTMLElement>('.info-toggle')].forEach((el) => {
        el.addEventListener('click', () => {
            console.log('el', el, el.dataset.id);

            const next = el.nextElementSibling;
            if (next?.classList.contains('more-info')) {
                next.remove();
            } else {
                const elId = el.dataset.id;

                const inputItem = elId && ReportData.allItemsById[elId];
                if (inputItem) {
                    const newText = ManiForm({ item: inputItem, idx: 0 });

                    const newEl = document.createElement('div');
                    newEl.classList.add('more-info', 'col-span-2');
                    newEl.innerHTML = `<div class="">${newText}</div>`;
                    el.parentElement?.insertBefore(newEl, el.nextElementSibling);
                }
            }
        });
    });

    parent.append(fragment);
}
