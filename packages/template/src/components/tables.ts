import { ItemInputFile, Report_InputFiles } from "@pmac/shared-types";

export function TableRow(input: ItemInputFile, isFirst: boolean, isLast: boolean) {
    return (`
    <div class="my-px px-2 py-1 bg-primary-200/20 ${isFirst?'rounded-tl':isLast?'rounded-bl':''}">${input.title || 'No login title'}</div>
    <div class="border-primary-300/10 border"></div>
    <div class="my-px px-2 py-1 bg-primary-200/20 ${isFirst?'rounded-tr':isLast?'rounded-br':''}">${input.short}</div>
    `);
}

export function TableAllInputs(inputs: Report_InputFiles) {
    const items = inputs?.input || [];
    return (`
    <div class="grid grid-cols-[auto_auto_minmax(0,1fr)] text-sm selection:bg-fuchsia-300 selection:text-fuchsia-900">
        ${items.map((input, idx) => TableRow(input, !idx, idx === items.length - 1)).join('')}
    </div>
    `);
}

//TODO: add column tiles
//TODO: add collapsible details
//TODO: limit max-w and center; truncate with ... and tooltips
