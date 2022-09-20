import { InputSameDcItem, ReportData } from "../utils/report-data";
import { splitByKey } from "../utils/utils";

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
        <div class="text-sm">${item.src.title}</div>
    </div>
    `;
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

function getManiInfoEl(el: HTMLElement): HTMLElement | undefined {
    const cardOrNext = el.nextElementSibling as HTMLElement;
    return cardOrNext?.classList.contains('mani-info') ? cardOrNext : undefined;
}

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

export function createTable(parent: HTMLElement) {
    const sameDcItems = ReportData.folderInputSameDcItems;
    const flatItems = sameDcItems.map(({ root, dcs }) => dcs).flat();

    const byDomain = Object.entries(splitByKey(flatItems, (item) => item.src.urls[0].domain || ''));
    const maniRows = `
        <div class="cursor-default">
            ${byDomain.map(([domain, items]) => `
                <div class="px-4 pb-2 font-semibold">
                    <div class="">${domain}</div>
                    <div class="px-2 text-sm max-w-3xl">
                        ${items.map((item) => ManiRow({ item })).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="pb-4 px-4 max-w-[80ch]">
            <div class="mt-4 mb-2 text-lg font-semibold">
                General info
            </div>
            <p>
                <a href="https://en.wikipedia.org/wiki/Uniform_Resource_Identifier">URL schema</a>

                <div class="whitespace-pre font-mono text-xs">
                userinfo       host      port
                ┌──┴───┐ ┌──────┴──────┐ ┌┴┐
        https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top
        └─┬─┘   └───────────┬──────────────┘└───────┬───────┘ └───────────┬─────────────┘ └┬┘
        scheme          authority                  path                 query           fragment

                                             
                               host                         
                         ┌──────┴──────┐                    
                userinfo │     domain  │ port
                ┌──┴───┐ │   ┌────┴────┐ ┌┴┐
        https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top
        └─┬─┘   └───────────┬──────────────┘└───────┬───────┘ └───────────┬─────────────┘ └┬┘
        scheme          authority                  path                 query           fragment
                </div>
            </p>
        </div>
        `;

    const fragment = document.createDocumentFragment();
    const rootEl = document.createElement('div');
    rootEl.innerHTML = maniRows;
    fragment.append(rootEl);

    [...fragment.querySelectorAll<HTMLElement>('.mani-row')].forEach(addRowClick);

    parent.append(fragment);
}
