import { Report, ReportRecord } from '@pmac/shared-types';

const reportData = require('@pmac/template');
const template = Buffer.from(reportData.template.skeleton, 'base64').toString();

const reports: Report = {};

export function addToReport(root: string, moreData: ReportRecord) {
    let thisRecord = reports[root];
    if (!thisRecord) {
        reports[thisRecord] = {};
        thisRecord = reports[thisRecord];
    }
    Object.entries(moreData).forEach(([key, val]) => (thisRecord as any)[key] = val);
}

export function makeHtmlReport(rootFolder: string): string | undefined {
    if (Object.keys(reports).length) {
        const dataStr = JSON.stringify(reports, null, 4);
        return template.replace('"__INJECTED__DATA__"', dataStr);
    }
}
