import { ItemInputFile, Report_InputFiles } from "@pmac/shared-types";

export function TableRow(input: ItemInputFile) {
    return (`
    <div class="">${input.title || 'No login title'}</div>
    <div class="">${input.short}</div>
    `);
}

export function TableAllInputs(inputs: Report_InputFiles) {
    return (`
    <div class="grid grid-cols-2">
        ${inputs?.input?.map((input) => TableRow(input)).join('')}
    </div>
    `);
}
