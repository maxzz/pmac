import '../index.css';
import { setupCounter } from './counter';
import { PageHeader } from './header';
//import { Report, Report_InputFiles } from '@pmac/shared-types';
import { report } from './test-data';

function H1(text: string) {
    return (`
    <h1 class="text-lg font-semibold" title="List of all files">${text}</h1>
    `);
}

function Button(id: string, text?: string) {
    return (`
    <button class="px-3 pt-1 pb-2 bg-primary-300/30 border-primary-700 hover:bg-primary-300/70 shadow active:scale-[.97] border rounded transition-all" id="${id}" type="button">${text || ''}</button>
    `);
}

function Para(text: string) {
    return (`
    <p class="">${text}</p>
    `);
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML =
    `
  <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
    ${PageHeader()}

    <div class="px-4 p-2">
        ${H1("All files")}

        ${Button("counter")}        

        ${Para("Click on the Vite and TypeScript logos to learn more")}
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

//<div class=""></div>
