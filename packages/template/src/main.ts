import { Button, H1, PageHeader, Para, setupCounter, TableAllInputs } from './components';
import { TableModified } from './components/table-modified';
import { createTable, generalInfoClick, toggleItems } from './components/table-summary';
import '../index.css';
import { PageFooter } from './components/header-footer';

//TODO: mx-auto

function App() {
    return `
        <div class="h-full grid grid-rows-[auto_auto_minmax(0,1fr)_auto] text-sky-800">
            ${PageHeader()}
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
            </div>
            <main id="report-table" class="overflow-y-auto"></main>
            ${PageFooter()}
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

    let expanded = false;
    fragment.querySelector<HTMLButtonElement>('#toggle-all')!.addEventListener('click', (event: MouseEvent) => {
        expanded = !expanded;
        toggleItems({ setOpen: expanded, justToggle: event.ctrlKey });
    });

    generalInfoClick(fragment.querySelector<HTMLButtonElement>('#toggle-general-info')!);

    appOrg.replaceWith(fragment);

    if (process.env.NODE_ENV !== 'production') {
        appNew.classList.add('debug-screens');
        //expanded = true, toggleItems({ setOpen: true });

        function test() {
            function fireEvs(el: HTMLInputElement): void {
                // Fire events is critical for linkedin.com; view=window (or unsafeWindow) does not work for firefox, but null is accepted by Ff and Ch.
                // For www.americanexpress.com select element does not show the value change without events.
                el.dispatchEvent(new UIEvent('input', { view: null, bubbles: true, cancelable: true }));
                el.dispatchEvent(new UIEvent('change', { view: null, bubbles: true, cancelable: true }));
            }
            function fireKeyEvs(el: HTMLElement): void {
        
                console.log('fireKeyEvs active', document.activeElement);
        
                const kevD = new KeyboardEvent('keydown', {key: '1', code: 'Digit1'});
                const kevP = new KeyboardEvent('keypress', {key: '1', code: 'Digit1'});
                const kevU = new KeyboardEvent('keyup', {key: '1', code: 'Digit1'});
                el.dispatchEvent(kevD);
                el.dispatchEvent(kevP);
                el.dispatchEvent(kevU);
        
                // const kevBkspD = new KeyboardEvent('keydown', {key: 'Backspace', code: 'Backspace'});
                // const kevBkspU = new KeyboardEvent('keyup', {key: 'Backspace', code: 'Backspace'});
                // el.dispatchEvent(kevBkspD);
                // el.dispatchEvent(kevBkspU);
        
                console.log('fireKeyEvs', el);
            }
        
            const inp = document.querySelector<HTMLInputElement>('#keys-test')!;

            ['keydown', 'keypress', 'keyup', 'input', 'change'].forEach((name) => {
                inp.addEventListener(name, (event: Event) => {
                    console.log(event.type, event);
                });
            });
    
            setTimeout(() => {
                console.log('active 1', document.activeElement);
                inp.focus();
                console.log('active 2', document.activeElement);
            }, 10);
    
            setTimeout(() => {
                console.log('active 3', document.activeElement);
                fireKeyEvs(document.body);
            }, 20);


        }
        test();
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
