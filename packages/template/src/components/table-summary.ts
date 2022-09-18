import { InputSameDcItem, ReportData } from "../utils/report-data";

function IconArrow() {
    return `
        <svg class="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-transparent data-state-open:rotate-90 transition-transform" viewBox="0 0 100 100">
            <path d="M 50 13 L 80 43 L 50 72"></path>
        </svg>`;
}

function ManiForm({ item, idx }: { item: InputSameDcItem, idx: number; }) {
    const formName = !idx ? 'Login' : 'Password change';
    const org = item.src?.urls?.[idx]?.ourl || '';
    const mod = item.dup?.urls?.[idx] || '';
    if (!org && !mod) { return ''; }
    return `
        <div class="">${formName}</div>
        <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
            <div class="text-xs">Prev URL:</div> <div class="text-red-700">${org}</div>
            <div class="text-xs">New URL:</div> <div class="text-green-700">${mod}</div>
        </div>`;
}

function ManiInfo(maniItem: InputSameDcItem) {
    return `
        <div class="ml-12 mt-2 mb-4 px-3 py-2 bg-primary-50 border-primary-300 border rounded text-xs">
            <div class="pb-2">
                <div class="">Domain: ${maniItem.src.urls?.[0]?.domain || ''}</div>
                <div class="">Filename: ${maniItem.src.short}</div>
            </div>
            ${ManiForm({ item: maniItem, idx: 0 })}
            ${ManiForm({ item: maniItem, idx: 1 })}
        </div>
    `;
}

function ManiRow({ item }: { item: InputSameDcItem; }) {
    return `
    <div class="mani-row flex items-center select-none cursor-pointer" data-id="${item.src.id}">
        <div class="flex-none text-primary-600">${IconArrow()}</div>
        <div class="">${item.src.title}</div>
    </div>
    `;
}

export function toggleItems({ setToOpen }: { setToOpen: boolean; }) {
    [...document.querySelectorAll<HTMLElement>('.mani-row')].forEach((el) => el.click());
}

//TODO: now this is toggle, not set state

function addRowClick(el: HTMLElement) {
    el.addEventListener('click', () => {
        const marker = el.firstElementChild?.firstElementChild as HTMLElement;
        const cardOrNext = el.nextElementSibling as HTMLElement;

        if (cardOrNext?.classList.contains('mani-info')) {
            marker && delete marker.dataset.state;
            cardOrNext.remove();
        } else {
            marker && (marker.dataset.state = 'open');

            const elId = el.dataset.id;
            const maniItem = elId && ReportData.allItemsById[elId];
            if (maniItem) {
                const newEl = document.createElement('div');
                newEl.classList.add('mani-info', 'col-span-2', 'animate-toast-slide-in-right');
                newEl.innerHTML = ManiInfo(maniItem);
                el.parentElement?.insertBefore(newEl, el.nextElementSibling);
            }
        }
    });
}

export function createTable(parent: HTMLElement) {
    const sameDcItems = ReportData.folderInputSameDcItems;
    const flatItems = sameDcItems.map(({ root, dcs }) => dcs).flat();

    const maniRows = `
        <div class="px-2 pb-8 max-w-3xl">
            ${flatItems.map((item) => ManiRow({ item })).join('')}
        </div>
    `;

    const fragment = document.createDocumentFragment();
    const rootEl = document.createElement('div');
    rootEl.innerHTML = maniRows;
    fragment.append(rootEl);

    [...fragment.querySelectorAll<HTMLElement>('.mani-row')].forEach(addRowClick);

    parent.append(fragment);
}
