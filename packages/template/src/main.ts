import { Button, H1, PageHeader, Para, setupCounter } from './components';
import { report } from './utils/test-data';
import { TableAllInputs } from './components';
import '../index.css';

function App() {
    const isEmpty = !report.inputs?.input?.length && !report.domcreds?.multiple?.length;
    return (`
        <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
            ${PageHeader()}

            <div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
                <div class="col-start-2">
                    ${TableAllInputs(report.inputs)}
                    ${isEmpty ? Para('There are no manifest files using domain credentials. Nothing changed') : ''}
                </div>
            </div>
        </div>
    `);
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = App();

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

// <!-- <br /> ${Button({ id: "counter" })} -->
// <!-- ${Para("Click on the Vite and TypeScript logos to learn more")} -->
