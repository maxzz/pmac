import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { TableModified } from './components/table-modified';
import { createTable } from './components/table-summary';
import '../index.css';

function App() {
    return `
        <div class="flex-1 h-full grid grid-rows-[auto_auto_minmax(0,1fr)] text-primary-900">
            ${PageHeader()}
            <div class="px-4 max-w-[85ch]">
                <div class="mt-4 mb-2 font-semibold text-primary-700">General info</div>
                Find all manifests that belong to the same domain and for them look for login forms with domain credentials. 
                Then set each of these login forms to be used only for exact matching URLs. 
            </div>
            <main id="report-table" class="overflow-y-auto"></main>
        </div>`;
}

function main() {
    const appOrg = document.querySelector<HTMLDivElement>('#app')!;

    const fragment = document.createDocumentFragment();

    const appNew = document.createElement('div');
    appNew.id = 'app';
    appNew.innerHTML = App();
    fragment.append(appNew);

    createTable(fragment.querySelector('#report-table')!);

    if (process.env.NODE_ENV !== 'production') {
        appNew.classList.add('debug-screens');
    }

    appOrg.replaceWith(fragment);
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

// <div class="flex-1 bg-gradient-to-t from-[#d6efff] to-[#d3e9ff] text-primary-900 debug-screens">
// <div class="flex-1 bg-gradient-to-t from-[#036eb3] to-[#1162b3] text-primary-900 debug-screens">
// <div class="flex-1 bg-gradient-to-t from-[#002d66] to-[#002d66] text-primary-900 debug-screens">

//TODO: new CLI swithces: add and remove domain file prefix
//TODO: sort by login name
