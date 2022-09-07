const reportData = require('../report-template/template-4-pmac.json');
const template = Buffer.from(reportData.skeleton, 'base64').toString();

const reports = {};

export function addToReport(moreData?: object) {
    //TODO: add to reports
}

export function makeHtmlReport(moreData?: object): string | undefined {
    if (!moreData) {
        return;
    }

    const data = {
        ...reports,
        ...moreData,
    };
    const dataStr = JSON.stringify(data);

    const newTemplate = template.replace('"__INJECTED__DATA__"', dataStr);
    return newTemplate;
}
