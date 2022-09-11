import { ItemInputFile, Report_InputFiles } from "@pmac/shared-types";
import { H1 } from "./components";

export function Row(col1: string, col2: string, isFirst: boolean, isLast: boolean) {
    return (`
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tl' : isLast ? 'rounded-bl' : ''}">${col1}</div>
    <div class="border-transparent border"></div>
    <div class="my-px px-2 py-1 bg-primary-100/50 ${isFirst ? 'rounded-tr' : isLast ? 'rounded-br' : ''}">${col2}</div>
    `);
}

export function TableRow(input: ItemInputFile, isFirst: boolean, isLast: boolean) {
    return Row(input.title || 'No login title', input.short, isFirst, isLast);
}

export function TableAllInputs(inputs?: Report_InputFiles) {
    if (!inputs?.input) {
        return '';
    }
    const items = inputs?.input || [];
    return (`
        ${H1("All files")}
        <div class="grid grid-cols-[auto_auto_minmax(0,1fr)] text-sm selection:bg-fuchsia-300 selection:text-fuchsia-900">
            ${items.map((input, idx) => TableRow(input, !idx, idx === items.length - 1)).join('')}
        </div>
    `);
}

//TODO: add column tiles
//TODO: add collapsible details
//TODO: limit max-w and center - done
//TODO: truncate with ... and tooltips - no need
