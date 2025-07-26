import path from "path";
import { color } from "../../utils";
import { Notes } from "../8-app-env";
import { type DuplFileCnts, type SingleFolder } from "../9-types";

export function printLoaded(singleFolder: SingleFolder) {

    singleFolder.fileCnts.forEach(
        (file) => {
            const [a, b] = [file.metaForms[0]?.urls.oUrlSplit?.woParms, file.metaForms[1]?.urls.oUrlSplit?.woParms];
            if (a || b) {
                Notes.add('--------------------------------');
                a && Notes.add(`    0: ${color.green(a)}`);
                b && Notes.add(`    1: ${color.green(b)}`);
            }
        }
    );

    singleFolder.fnamesEmpty.forEach(
        (filename) => {
            Notes.add(color.bgBlue(color.green(`empty --------------------------------${path.basename(filename)}`)));
        }
    );

    singleFolder.fnamesFailed.forEach(
        (filename) => {
            Notes.add(color.bgBlue(color.green(`failed --------------------------------${path.basename(filename)}`)));
        }
    );
}

export function printDcActive(duplFileCnts: DuplFileCnts[]) {
    const entries = duplFileCnts.map(
        ({ domain, fileCnts }) => {
            const items = fileCnts.map(
                (fileCnt) => `\n    ${fileCnt.metaForms[0]?.urls.oUrlSplit?.woParms}`
            ).join('');
            return color.red(`${domain} ${fileCnts.length}${items}`);
        }
    );

    entries.forEach((item) => {
        console.log(item);
    });
}
