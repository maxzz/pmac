const reportData = require('../report-template/template-4-pmac.json');
const template = Buffer.from(reportData.skeleton, 'base64').toString();

const reports: any = {};

export function addToReport(moreData: object) {
    Object.entries(moreData).forEach(([key, val]) => reports[key] = val);
}

export function makeHtmlReport(rootFolder: string): string | undefined {
    const dataStr = JSON.stringify(reports, null, 4);
    const newTemplate = template.replace('"__INJECTED__DATA__"', dataStr);
    return newTemplate;
}
