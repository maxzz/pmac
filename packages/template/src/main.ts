import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { TableModified } from './components/table-modified';
import { createTable, generalInfoClick, toggleItems } from './components/table-summary';
import '../index.css';
import { PageFooter } from './components/header-footer';

//TODO: mx-auto

function AboutSection() {
    return `
        <div class="px-4 max-w-[80ch]">
            <div class="mt-4 mb-2 text-lg font-semibold">
                About
            </div>
            <p>
                This utility checked all manifests belonging to the same domain and for each of them looked for login forms with domain credentials. 
                Then set each of these login forms to be used only for exact matching URLs.
            </p>
            <div class="mt-4 mb-2 text-lg font-semibold">
                Updated manifests
            </div>
        </div>`
}

function App() {
    return `
        <div class="h-full grid grid-rows-[auto_minmax(0,1fr)_auto] text-sky-800">
            ${PageHeader()}
            <div class="h-full grid grid-rows-[auto_minmax(0,1fr)]">
                ${AboutSection()}
                <main id="report-table" class="overflow-y-auto"></main>
            </div>
            ${PageFooter()}
        </div>`;
}

// function App() {
//     return `
//         <div class="h-full grid grid-rows-[auto_auto_minmax(0,1fr)_auto] text-sky-800">
//             ${PageHeader()}
//             ${AboutSection()}
//             <main id="report-table" class="overflow-y-auto"></main>
//             ${PageFooter()}
//         </div>`;
// }

function createAppFragment() {
    const fragment = document.createDocumentFragment();

    const appNew = document.createElement('div');
    appNew.id = 'app';
    appNew.innerHTML = App();
    fragment.append(appNew);

    createTable(fragment.querySelector('#report-table')!);
    
    return fragment;
}

function addEventListeners(fragment: DocumentFragment) {
    let expanded = false;
    fragment.querySelector<HTMLButtonElement>('#toggle-all')!.addEventListener('click', (event: MouseEvent) => {
        expanded = !expanded;
        toggleItems({ setOpen: expanded, justToggle: event.ctrlKey });
    });

    generalInfoClick(fragment.querySelector<HTMLButtonElement>('#toggle-general-info')!);
}

function main() {
    const fragment = createAppFragment();
    addEventListeners(fragment);
    document.querySelector<HTMLDivElement>('#app')!.replaceWith(fragment);

    if (process.env.NODE_ENV !== 'production') {
        document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');
        //expanded = true, toggleItems({ setOpen: true });
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
