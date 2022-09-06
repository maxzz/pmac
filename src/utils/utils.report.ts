const reportData = require('../report-template/template-4-pmac.json');

export function makeHtmlReport() {
    const template = Buffer.from(reportData.skeleton, 'base64').toString();
    console.log('reportData', template);
}
