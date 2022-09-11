import { Button, H1, PageHeader, Para, setupCounter } from './components';
import { report } from './utils/test-data';
import '../index.css';
import { TableAllInputs } from './components/tables';

function App() {
    return (`
        <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
            ${PageHeader()}

            <div class="px-4 p-2 grid grid-cols-[1fr_minmax(100px,auto)_1fr]">
                <div class="col-start-2">
                    ${H1("All files")}

                    ${report.inputs ? TableAllInputs(report.inputs) : ''}

                    <!--
                    <br />
                    ${Button({ id: "counter" })}
                    -->

                    <!-- ${Para("Click on the Vite and TypeScript logos to learn more")} -->
                </div>
            </div>
        </div>
    `);
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = App();

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);

//<div class=""></div>
