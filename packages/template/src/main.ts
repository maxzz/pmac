import '../index.css';
import { setupCounter } from './counter';
import { PageHeader } from './header';
//import { Report, Report_InputFiles } from '@pmac/shared-types';
import { report } from './test-data';

const app = document.querySelector<HTMLDivElement>('#app')!;

function H1(label: string) {
    return (`
    <h1 class="text-lg font-semibold" title="List of all files">${label}</h1>
    `)
}

app.innerHTML =
    `
  <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
    ${PageHeader()}

    <div class="px-4 p-2">
        ${H1("All files")}

        <div class="card">
        <button class="px-3 pt-1 pb-2 border-primary-700 border rounded" id="counter" type="button"></button>
        </div>

        <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
        </p>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

//<div class=""></div>
