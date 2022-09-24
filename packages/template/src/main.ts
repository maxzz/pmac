import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { TableModified } from './components/nun/table-modified';
import { Section2_About } from './components/section2-about';
import { createTable, toggleItems } from './components/section3_updated-files';
import { generalInfoClick } from './components/section4-general-info';
import { Section5_Footer } from './components/section5-footer';
import '../index.css';

function App() {
    return `
        <div class="h-full grid grid-rows-[auto_minmax(0,1fr)_auto] text-sky-800">
            ${PageHeader()}
            <div class="mx-auto h-full grid grid-rows-[auto_minmax(0,1fr)] overflow-y-auto">
                ${Section2_About()}
                <main id="report-table"></main>
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

    createTable(fragment.querySelector('#report-table')!);
    
    return fragment;
}

function addEventListeners(fragment: DocumentFragment, appState: AppState) {
    fragment.querySelector<HTMLButtonElement>('#toggle-all')!.addEventListener('click', (event: MouseEvent) => {
        appState.expanded = !appState.expanded;
        toggleItems({ setOpen: appState.expanded, justToggle: event.ctrlKey });
    });

    generalInfoClick(fragment.querySelector<HTMLButtonElement>('#toggle-general-info')!);
}

type AppState = {
    expanded: boolean;
}

function main() {
    const appState: AppState = {
        expanded: false,
    };
    const fragment = createAppFragment();
    addEventListeners(fragment, appState);
    document.querySelector<HTMLDivElement>('#app')!.replaceWith(fragment);

    if (process.env.NODE_ENV !== 'production') {
        document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');
        appState.expanded = true, toggleItems({ setOpen: true });
    }
}
main();

// <!-- <br /> ${Button({ id: "counter" })} -->
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

// function singleReport(single: Report) {
//     const isEmpty = !Object.keys(single).length; //TODO: !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
//     return `
//         <div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
//             <div class="col-start-2">
//                 ${TableAllInputs(single?.inputs)}
//                 ${isEmpty ? Para({ text: 'There are no manifest files using domain credentials. Nothing changed' }) : ''}
//             </div>
//         </div>`;
// }
//
// function App() {
//     return `
//         <div class="flex-1 from-[#d6efff] to-[#d3e9ff] text-primary-900 debug-screens">
//             ${PageHeader()}
//             ${reportData.map((report) => singleReport(report)).join('')}
//             ${TableModified(reportData)}
//         </div>`;
// }

//TODO: new CLI swithces: add and remove domain file prefix
//TODO: sort by login name
