import { Button, H1, PageHeader, Para, setupCounter } from './components';
import { report } from './utils/test-data';
import { TableAllInputs } from './components';
import '../index.css';
import { Report } from '@pmac/shared-types';

function singleReport(single: Report) {
    const isEmpty = !Object.keys(single).length; //TODO: !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
    return `
<div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
    <div class="col-start-2">
        ${TableAllInputs(single?.inputs)}
        ${isEmpty ? Para('There are no manifest files using domain credentials. Nothing changed') : ''}
    </div>
</div>
`;
}

function App() {
    const allRecords = Object.entries(report);
    const isEmpty = !allRecords.length; //TODO: !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
    const [_, reportFirst] = allRecords[0];
    const r = singleReport(report);
    return (`
        <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
            ${PageHeader()}
            ${singleReport(report)}
        </div>
    `);
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = App();

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

// <!-- <br /> ${Button({ id: "counter" })} -->
// <!-- ${Para("Click on the Vite and TypeScript logos to learn more")} -->
