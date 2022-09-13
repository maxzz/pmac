import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { Report } from '@pmac/shared-types';
import { reportData } from './utils/report-data';
import '../index.css';

function singleReport(single: Report) {
    const isEmpty = !Object.keys(single).length; //TODO: !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
    return `
        <div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
            <div class="col-start-2">
                ${TableAllInputs(single?.inputs)}
                ${isEmpty ? Para({text: 'There are no manifest files using domain credentials. Nothing changed'}) : ''}
            </div>
        </div>`;
}

function App() {
    return `
        <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
            ${PageHeader()}
            ${reportData.map((report) => singleReport(report)).join('')}
        </div>`;
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = App();

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', reportData);

// <!-- <br /> ${Button({ id: "counter" })} -->

