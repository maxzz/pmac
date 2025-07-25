import { ItemInputFile, Report_InputFiles } from "@pmac/shared-types";
import { H1 } from "./8-components";

function HeaderRow({ col1, col2 }: { col1: string, col2: string; }) {
    return (`
    <div class="my-px px-2 text-xs rounded-tl">${col1}</div>
    <div class="border-transparent border"></div>
    <div class="my-px px-2 text-xs rounded-tr">${col2}</div>
    `);
}

function Row({ col1, col2, isFirst, isLast }: { col1: string, col2: string, isFirst: boolean, isLast: boolean; }) {
    return (`
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tl' : isLast ? 'rounded-bl' : ''}">${col1}</div>
    <div class="border-transparent border"></div>
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tr' : isLast ? 'rounded-br' : ''}">${col2}</div>
    `);
}

function TableRow(input: ItemInputFile, isFirst: boolean, isLast: boolean) {
    return Row({ col1: input.title || 'No login title', col2: input.short, isFirst, isLast });
}

// export function TableAllInputs(inputs?: Report_InputFiles) {
//     if (!inputs?.input) {
//         return '';
//     }
//     const items = inputs?.input || [];
//     return (`
//         ${H1({ text: "All files" })}
//         <div class="grid grid-cols-[auto_auto_minmax(0,1fr)] text-sm text-textovergrad">
//             ${HeaderRow({ col1: 'Login name', col2: 'File name' })}

//             ${items.map((input, idx) => TableRow(input, !idx, idx === items.length - 1)).join('')}
//         </div>
//     `);
// }

export function TableAllInputs(inputs?: Report_InputFiles) {
    if (!inputs?.input) {
        return '';
    }
    const items = inputs?.input || [];
    return (`
        <details class="md:min-w-[85ch]" open>
        <summary class="text-lg font-semibold">All manifest files</summary>
        <div class="grid grid-cols-[auto_auto_minmax(0,1fr)] md:grid-cols-[minmax(270px,auto)_auto_minmax(0,1fr)] text-sm text-textovergrad">
            ${HeaderRow({ col1: 'Login name', col2: 'File name' })}

            ${items.map((input, idx) => TableRow(input, !idx, idx === items.length - 1)).join('')}
        </div>
        </details>
    `);
}

//TODO: add column titles - done
//TODO: add collapsible details
//TODO: limit max-w and center - done
//TODO: truncate with ... and tooltips - no need
