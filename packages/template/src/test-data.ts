import { Report, Report_InputFiles } from '@pmac/shared-types';

"<node>";
export const report_InputFiles: Report_InputFiles = {
    input: [{
        file: 'filename1'
    }, {
        file: 'filename2'
    }]
};
"<deno>";

if (process.env.NODE_ENV !== 'production') {
    console.log('only dev');

    const inputFiles: Report_InputFiles = {
        input: [{
            file: 'filename1'
        }, {
            file: 'filename2'
        }]
    };

    const report: Report = {
        inputs: inputFiles,
    };

    (window as any)['tmReport'] = report;
}

export function invokeModule() { }
export const report: Report = (window as any)['tmReport'];
