import { TargetGroup } from "../app-types";

const reportData = require('@pmac/template');
export const templateStr = Buffer.from(reportData.template.skeleton, 'base64').toString();

export function hasDomCredsReport(targetGroup: TargetGroup) {
    return !!targetGroup.report.domcreds?.multiple?.length;
}
