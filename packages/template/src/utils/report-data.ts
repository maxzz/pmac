import { ItemInputFile, Report } from '@pmac/shared-types';

export { reports as reportData } from './test-data';

function getInputs(report: Report): Record<string, ItemInputFile> {
    const inputs = report.inputs?.input?.reduce<Record<string, ItemInputFile>>((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});
    return inputs || {};
}

export function getSameDc(report: Report): ItemInputFile[] {
    const inputs =getInputs(report);
    return report.domcreds?.multiple?.map((item) => inputs[item.id]) || [];
}
