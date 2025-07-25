import { Section1_Header, Section2_About, Section3_UpdatedFiles, Section3_UpdatedFiles_Events, Section4_GeneralInfo, Section5_Footer, Section5_Footer_Events } from "./components";
import "../index.css";

function App() {
    return `
    <div class="h-full grid grid-rows-[auto_minmax(0,1fr)_auto] text-sky-800">
        ${Section1_Header()}
        <div class="w-full h-full overflow-auto">
            <div class="mx-auto md:w-max h-full grid grid-rows-[auto_1fr]">
                ${Section2_About()}
                <div>
                    <main id="report-table">
                        ${Section3_UpdatedFiles()}
                    </main>
                    <div class="pb-4 px-4 max-w-[80ch] animate-slide-down hidden" id="general-info">
                        ${Section4_GeneralInfo()}
                    </div>
                </div>
            </div>
        </div>
        ${Section5_Footer()}
    </div>`;
}

function createAppFragment() {
    const fragment = document.createDocumentFragment();

    const appNew = document.createElement('div');
    appNew.id = 'app';
    appNew.innerHTML = App();
    fragment.append(appNew);

    return fragment;
}

export type AppState = {
    expanded: boolean;
};

function main() {
    const appState: AppState = {
        expanded: false,
    };
    const fragment = createAppFragment();
    Section3_UpdatedFiles_Events(fragment);
    Section5_Footer_Events(fragment, appState);
    document.querySelector<HTMLDivElement>('#app')!.replaceWith(fragment);

    if (process.env.NODE_ENV !== 'production') {
        document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');
        //document.getElementById('toggle-general-info')?.click();
        //appState.expanded = true, toggleItems({ setOpen: true });
    }
}
main();
