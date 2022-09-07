const reportData = require('@pmac/template');
const template = Buffer.from(reportData.template.skeleton, 'base64').toString();

export type Report_InputFiles = {
    input?: {
        file: string;
    }[];
};

export type Report_Duplicates = {
    duplicates?: {
        file: string;
    }[];
};

export type ReportRecords = Report_InputFiles | Report_Duplicates;

const reports: ReportRecords = {};

export function addToReport(moreData: ReportRecords) {
    Object.entries(moreData).forEach(([key, val]) => (reports as any)[key] = val);
}

export function makeHtmlReport(rootFolder: string): string | undefined {
    const dataStr = JSON.stringify(reports, null, 4);
    
    if (!Object.keys(reports).length) {
        return;
    }
    
    return template.replace('"__INJECTED__DATA__"', dataStr);
}
