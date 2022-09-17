import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { Report } from '@pmac/shared-types';
import { ReportData } from './utils/report-data';
import '../index.css';
import { TableModified } from './components/table-modified';
import { createTable } from './components/table-summary';

function singleReport(single: Report) {
    const isEmpty = !Object.keys(single).length; //TODO: !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
    return `
        <div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
            <div class="col-start-2">
                ${TableAllInputs(single?.inputs)}
                ${isEmpty ? Para({ text: 'There are no manifest files using domain credentials. Nothing changed' }) : ''}
            </div>
        </div>`;
}

function App() {
    return `
        <div class="flex-1 h-full grid grid-rows-[auto_minmax(0_1fr)] text-primary-900 debug-screens">
            ${PageHeader()}
            <div id="report-table" class="overflow-y-auto"></div>
        </div>`;
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = App();

createTable(document.querySelector('#report-table')!);

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', ReportData.reportData);

// <!-- <br /> ${Button({ id: "counter" })} -->

// <div class="flex-1 bg-gradient-to-t from-[#d6efff] to-[#d3e9ff] text-primary-900 debug-screens">
// <div class="flex-1 bg-gradient-to-t from-[#036eb3] to-[#1162b3] text-primary-900 debug-screens">
// <div class="flex-1 bg-gradient-to-t from-[#002d66] to-[#002d66] text-primary-900 debug-screens">

//TODO: new CLI swithces: add and remove domain file prefix
//TODO: sort by login name

// function App() {
//     return `
//         <div class="flex-1 from-[#d6efff] to-[#d3e9ff] text-primary-900 debug-screens">
//             ${PageHeader()}
//             ${reportData.map((report) => singleReport(report)).join('')}
//             ${TableModified(reportData)}
//         </div>`;
// }
