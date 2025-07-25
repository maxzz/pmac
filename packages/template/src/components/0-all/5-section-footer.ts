import { AppState } from "../../main";
import { toggleItems } from "./3-section-updated-files";

export function Section5_Footer() {
    return `
    <footer class="px-4 text-primary-200 bg-title3/50 cursor-default select-none">
        <div class="mx-auto max-w-3xl flex items-center justify-between">
            <div class="text-xs flex-1">
                © 2022 HID Global Corporation, part of ASSA ABLOY. All rights reserved.
            </div>
            <div class="mr-0 lg:-mr-6 pr-0 md:pr-4 lg:pr-0">
                <button id="toggle-general-info" class="my-2 px-2 pt-1 pb-1.5 text-xs hover:bg-primary-600 border-primary-300 border rounded shadow active:scale-[.97]"
                    title="Show/Hide general information"
                >Show General Info</button>
                <button id="toggle-all" class="my-2 px-2 pt-1 pb-1.5 text-xs hover:bg-primary-600 border-primary-300 border rounded shadow active:scale-[.97]"
                    title="Expand/Collapse additional information about all items\nCtrl + Click to toggle open/closed items"
                >Toggle All</button>
            </div>
        </div">
    </footer>`; // Expand all
}

export function AddClickListeners_Footer(fragment: DocumentFragment, appState: AppState) {

    fragment.querySelector<HTMLButtonElement>('#toggle-general-info')?.addEventListener('click',
        () => {
            const info = document.getElementById('general-info')!;
            info.classList.toggle('hidden');
            if (!info.classList.contains('hidden')) {
                info.scrollIntoView();
            }
            updateGeneralInfoBtnText();
        }
    );

    fragment.querySelector<HTMLButtonElement>('#toggle-all')?.addEventListener('click',
        (event: MouseEvent) => {
            appState.expanded = !appState.expanded;
            toggleItems({ setOpen: appState.expanded, justToggle: event.ctrlKey });
        }
    );

    function updateGeneralInfoBtnText() {
        const info = document.getElementById('general-info');
        const toggle = document.getElementById('toggle-general-info');
        const text = `${info?.classList.contains('hidden') ? 'Show' : 'Hide'} General Info`;
        toggle && (toggle.innerText = text);
    }
}
