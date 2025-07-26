import path from "path";
import { color } from "../../utils";
import { Notes } from "../app-env";
import { type SameDc, type TargetGroup } from "../9-types";

// Local console log reports

export function printLoaded(targetGroup: TargetGroup) {

    targetGroup.files.forEach((file) => {
        const [a, b] = [file.urls[0]?.oParts?.woParms, file.urls[1]?.oParts?.woParms];
        if (a || b) {
            Notes.add('--------------------------------');
            a && Notes.add(`    0: ${color.green(a)}`);
            b && Notes.add(`    1: ${color.green(b)}`);
        }
    });

    targetGroup.empty.forEach((file) => {
        Notes.add(color.bgBlue(color.green(`empty --------------------------------${path.basename(file)}`)));
    });

    targetGroup.failed.forEach((file) => {
        Notes.add(color.bgBlue(color.green(`failed --------------------------------${path.basename(file)}`)));
    });
}

export function printDcActive(sameDC: SameDc[]) {
    const entries = sameDC.map(({ domain, files }) => {
        const items = files.map((item) => `\n    ${item.urls[0]?.oParts?.woParms}`).join('');
        return color.red(`${domain} ${files.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}
