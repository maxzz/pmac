import { InputSameDcItem, ReportData } from "../utils/report-data";



function IconArrow(right: boolean) {
    const righrOrDown = right ? 'M 50 13 L 80 43 L 50 72' : 'M 80 35 L 50 65 L 20 35';
    return `
    <svg class="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-transparent data-state-open:rotate-90 transition-transform" viewBox="0 0 100 100"><path d="${righrOrDown}"></path></svg>
    `;
}

function ManiForm({ item, idx }: { item: InputSameDcItem, idx: number; }) {
    const formName = !idx ? 'Login' : 'Password change';
    const org = item.src?.urls?.[idx]?.ourl || '';
    const mod = item.dup?.urls?.[idx] || '';
    if (!org && !mod) { return ''; }
    return `
        <div class="ml-12 px-3 py-2 bg-primary-50 border-primary-300 border rounded text-xs">
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
    <div class="info-toggle flex items-center select-none cursor-pointer" data-id="${item.src.id}">
        <div class="flex-none">${IconArrow(true)}</div>
        <div class="">${item.src.title}</div>
    </div>
    `;
}

export function createTable(parent: HTMLElement) {
    const sameDcItems = ReportData.folderInputSameDcItems;
    const flatItems = sameDcItems.map(({ root, dcs }) => dcs).flat();

    const itemsText = `
        <div class="max-w-3xl px-4">
        ${flatItems.map((item) => Mani({ item })).join('')}
        </div>
    `;

    const fragment = document.createDocumentFragment();
    const rootEl = document.createElement('div');
    rootEl.innerHTML = itemsText;
    fragment.append(rootEl);

    [...fragment.querySelectorAll<HTMLElement>('.info-toggle')].forEach((el) => {
        el.addEventListener('click', () => {
            const marker = el.firstElementChild?.firstElementChild as HTMLElement;
            const cardOrNext = el.nextElementSibling as HTMLElement;

            if (cardOrNext?.classList.contains('info-card')) {
                marker && delete marker.dataset.state;
                cardOrNext.remove();
            } else {
                marker && (marker.dataset.state = 'open');

                const elId = el.dataset.id;
                const maniItem = elId && ReportData.allItemsById[elId];
                if (maniItem) {
                    const newEl = document.createElement('div');
                    newEl.classList.add('info-card', 'col-span-2');
                    newEl.innerHTML = `<div class="">${ManiForm({ item: maniItem, idx: 0 })}</div>`;
                    el.parentElement?.insertBefore(newEl, el.nextElementSibling);
                }
            }
        });
    });

    parent.append(fragment);
}
