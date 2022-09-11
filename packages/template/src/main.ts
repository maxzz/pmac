import { Button, H1, PageHeader, Para, setupCounter } from './components';
import { report } from './utils/test-data';
import '../index.css';
import { TableAllInputs } from './components/tables';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML =
    `
  <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
    ${PageHeader()}

    <div class="px-4 p-2">
        ${H1("All files")}

        ${report.inputs ? TableAllInputs(report.inputs) : ''}

        <br />
        ${Button("counter")}

        <!-- ${Para("Click on the Vite and TypeScript logos to learn more")} -->
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

//<div class=""></div>
