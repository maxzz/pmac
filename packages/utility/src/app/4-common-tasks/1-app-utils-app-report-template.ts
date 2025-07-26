import { type SingleFolder } from "../9-types";

const reportData = require('@pmac/template');

export const templateStr = Buffer.from(reportData.template.skeleton, 'base64').toString();

export function numberOfDomCreds(singleFolder: SingleFolder): number {
    return singleFolder.report.domcreds?.multiple?.length || 0;
}
