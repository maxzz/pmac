import { ItemInputFile, Report_InputFiles } from "@pmac/shared-types";

export function TableRow(input: ItemInputFile) {
    return (`
    <div class="my-px px-2 py-1 bg-primary-200/20">${input.title || 'No login title'}</div>
    <div class="border-primary-500 border-l"></div>
    <div class="my-px px-2 py-1 bg-primary-200/20">${input.short}</div>
    `);
}

export function TableAllInputs(inputs: Report_InputFiles) {
    return (`
    <div class="grid grid-cols-[auto_auto_minmax(0,1fr)]">
        ${inputs?.input?.map((input) => TableRow(input)).join('')}
    </div>
    `);
}
