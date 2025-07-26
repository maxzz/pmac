import path from "path";
import { color } from "../../utils";
import { Notes } from "../8-app-env";
import { type SameDomainCreds, type SingleFolder } from "../9-types";

// Local console log reports

export function printLoaded(singleFolder: SingleFolder) {

    singleFolder.files.forEach((file) => {
        const [a, b] = [file.urls[0]?.oUrlSplit?.woParms, file.urls[1]?.oUrlSplit?.woParms];
        if (a || b) {
            Notes.add('--------------------------------');
            a && Notes.add(`    0: ${color.green(a)}`);
            b && Notes.add(`    1: ${color.green(b)}`);
        }
    });

    singleFolder.fnamesEmpty.forEach((file) => {
        Notes.add(color.bgBlue(color.green(`empty --------------------------------${path.basename(file)}`)));
    });

    singleFolder.fnamesFailed.forEach((file) => {
        Notes.add(color.bgBlue(color.green(`failed --------------------------------${path.basename(file)}`)));
    });
}

export function printDcActive(sameDC: SameDomainCreds[]) {
    const entries = sameDC.map(({ domain, files }) => {
        const items = files.map((item) => `\n    ${item.urls[0]?.oUrlSplit?.woParms}`).join('');
        return color.red(`${domain} ${files.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}
