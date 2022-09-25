import { Section1_Header } from './components/section1-header';
import { Section2_About } from './components/section2-about';
import { addUpdatedFilesEventListeners, Section3_UpdatedFiles, Section3_UpdatedFilesOld, toggleItems } from './components/section3-updated-files';
import { Section4_GeneralInfo, generalInfoClick } from './components/section4-general-info';
import { Section5_Footer } from './components/section5-footer';
import '../index.css';

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

    //Section3_UpdatedFilesOld(fragment.querySelector('#report-table')!);

    return fragment;
}

function addFooterEventListeners(fragment: DocumentFragment, appState: AppState) {
    fragment.querySelector<HTMLButtonElement>('#toggle-all')!.addEventListener('click', (event: MouseEvent) => {
        appState.expanded = !appState.expanded;
        toggleItems({ setOpen: appState.expanded, justToggle: event.ctrlKey });
    });

    generalInfoClick(fragment.querySelector<HTMLButtonElement>('#toggle-general-info')!);
}

type AppState = {
    expanded: boolean;
};

function main() {
    const appState: AppState = {
        expanded: false,
    };
    const fragment = createAppFragment();
    addUpdatedFilesEventListeners(fragment);
    addFooterEventListeners(fragment, appState);
    document.querySelector<HTMLDivElement>('#app')!.replaceWith(fragment);

    if (process.env.NODE_ENV !== 'production') {
        document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');
        //document.getElementById('toggle-general-info')?.click();
        //appState.expanded = true, toggleItems({ setOpen: true });
    }
}
main();

//TODO: sort by login name - no need
//TODO: new CLI swithces: add and remove domain file prefix
