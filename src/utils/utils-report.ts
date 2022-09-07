const reportData = require('../report-template/template-4-pmac.json');
const template = Buffer.from(reportData.skeleton, 'base64').toString();

export type RecordInputFiles = {
    input?: {
        file: string;
    }[];
};

export type RecordDuplicates = {
    duplicates?: {
        file: string;
    }[];
};

export type ReportRecords = RecordInputFiles | RecordDuplicates;

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
