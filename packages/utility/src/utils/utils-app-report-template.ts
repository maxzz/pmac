const reportData = require('@pmac/template');
export const templateStr = Buffer.from(reportData.template.skeleton, 'base64').toString();
