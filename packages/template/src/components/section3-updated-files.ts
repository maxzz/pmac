import { InputSameDcItem, ReportData } from "../utils/report-data";
import { splitByKey } from "../utils/utils";

function IconArrow() {
    return `
        <svg class="p-1 pb-0 w-6 h-6 stroke-current stroke-[.6rem] fill-transparent data-state-open:rotate-90 transition-transform" viewBox="0 0 100 100">
            <path d="M 50 13 L 80 43 L 50 72"></path>
        </svg>`;
}

function ManiForm({ item, idx }: { item: InputSameDcItem, idx: number; }) {
    const formName = !idx ? 'Login' : 'Password change';
    const org = item.src?.urls?.[idx]?.ourl || '';
    const mod = item.dup?.urls?.[idx] || '';
    if (!org && !mod) { return ''; }
    return `
        <div>${formName}</div>
        <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
            <div class="text-xs">Prev URL:</div> <div class="text-red-700">${org}</div>
            <div class="text-xs">New URL:</div> <div class="text-green-700">${mod}</div>
        </div>`;
} //TODO: min-w-0 break-words

function ManiInfo(maniItem: InputSameDcItem) {
    return `
        <div class="ml-12 mt-2 mb-4 px-3 py-2 bg-primary-50 border-primary-300 border rounded text-xs">
            <div class="pb-2">
                <div>Domain: ${maniItem.src.urls?.[0]?.domain || ''}</div>
                <div>Filename: ${maniItem.src.short}</div>
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
        <div class="text-sm">${item.src.title}</div>
    </div>
    `;
}

export function Section3_UpdatedFiles() {
    const sameDcItems = ReportData.folderInputSameDcItems;
    const flatItems = sameDcItems.map(({ root, dcs }) => dcs).flat();

    const byDomain = Object.entries(splitByKey(flatItems, (item) => item.src.urls[0].domain || ''));
    const maniRows = !byDomain.length
        ? `<div class="px-4">Nothing has been updated. There are no logins using shared domain credentials.</div>`
        : `<div class="cursor-default">
                ${byDomain.map(([domain, items]) => `
                    <div class="px-4 pb-2 font-semibold">
                        <div>${domain}</div>
                        <div class="px-2 text-sm max-w-3xl">
                            ${items.map((item) => ManiRow({ item })).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;
    return maniRows;
}

export function Section3_UpdatedFilesOld(parent: HTMLElement) {
    const maniRows = Section3_UpdatedFiles();

    const fragment = document.createDocumentFragment();
    const rootEl = document.createElement('div');
    rootEl.innerHTML = maniRows;
    fragment.append(rootEl);

    parent.append(fragment);
}

function getManiInfoEl(el: HTMLElement): HTMLElement | undefined {
    const cardOrNext = el.nextElementSibling as HTMLElement;
    return cardOrNext?.classList.contains('mani-info') ? cardOrNext : undefined;
}

export function addUpdatedFilesEventListeners(fragment: DocumentFragment) {
    function addRowClick(el: HTMLElement) {
        el.addEventListener('click', () => {
            const marker = el.firstElementChild?.firstElementChild as HTMLElement;
            const maniInfoEl = getManiInfoEl(el);

            if (maniInfoEl) {
                marker && delete marker.dataset.state;
                maniInfoEl.remove();
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

    [...fragment.querySelectorAll<HTMLElement>('.mani-row')].forEach(addRowClick);
}

export function toggleItems({ setOpen, justToggle = false }: { setOpen: boolean; justToggle?: boolean; }) {
    const allRows = [...document.querySelectorAll<HTMLElement>('.mani-row')];
    allRows.forEach((el) => {
        if (justToggle) {
            el.click();
        } else {
            const maniInfoEl = getManiInfoEl(el);
            if ((setOpen && !maniInfoEl) || (!setOpen && maniInfoEl)) {
                el.click();
            }
        }
    });
}
