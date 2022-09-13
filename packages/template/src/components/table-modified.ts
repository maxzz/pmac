import { ItemInputFile, ReportRecords, Report_InputFiles } from "@pmac/shared-types";
import { H1 } from "./components";

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

export function TableModified(report: ReportRecords) {
    return (`
        ${H1({ text: "Modified manifest files" })}
        <div class="">
            <div class="ml-4">
                ${H1({text: "Folder"})}

                <div class="">Domain</div>
                <div class="border-primary-700 border rounded bg-red-500">
                    
                    <div class="ml-4">
                        Manifest
                        <div class="ml-8">
                            Username
                        </div>
                        <div class="ml-8">
                            Filename
                        </div>

                        <div class="ml-4">
                            Form Login
                            <div class="ml-4">
                                Old URL
                            </div>
                            <div class="ml-4">
                                New URL
                            </div>
                        </div>
                        <div class="ml-4">
                            Form Password Change
                            <div class="ml-4">
                                Old URL
                            </div>
                            <div class="ml-4">
                                New URL
                            </div>
                        </div>
                    </div>
    
                </div>

            </div>

            
        </div>
    `);
}
