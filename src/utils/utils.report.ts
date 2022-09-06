const reportData = require('../report-template/template-4-pmac.json');

export function makeHtmlReport(moreData?: any): string | undefined {
    if (!moreData) {
        return;
    }

    const data = {
        here: 'we go 5',
        ...moreData,
    };

    const dataStr = JSON.stringify(data);

    const template = Buffer.from(reportData.skeleton, 'base64').toString();

    const newTemplate = template.replace('"__INJECTED__DATA__"', dataStr);

    console.log('newTemplate', newTemplate);

    return newTemplate;
}
