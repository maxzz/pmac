import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Matching, Meta, parseXMLFile } from "../manifest";
import { notes } from "./help";
import chalk from "chalk";
import { FormUrls, getFormUrls } from "./utils-mani-urls";
import { ensureNameUnique, nowDayTime } from "./unique-names";
import { osStuff } from "./utils-os";

export function filterByExtension(fnames: string[], ext: string): string[] {
    return fnames.filter((item) => path.extname(item).toLowerCase() === ext);
}

export function getParentFolder(fnames: string[]): string | undefined {
    // 0. Returns fnames paretn folder or undefined if fnames from a different folders.

    const res = fnames.reduce((acc, cur) => {
        acc[path.dirname(cur)] = true;
        return acc;
    }, {} as Record<string, boolean>);

    const keys = Object.keys(res);
    return keys.length === 1 ? keys[0] : undefined;
}

// Manifest loading

export type FileMeta = {
    mani: Mani.Manifest;
    forms: Meta.Form[];
    urls: FormUrls[];
    raw: string;
    fname: string;
};

export type LoadedManifests = {
    files: FileMeta[];
    empty: string[];
    failed: string[];
};

export function loadManifests(fnames: string[]): LoadedManifests {
    const rv: LoadedManifests = { files: [], empty: [], failed: [], };

    for (const file of fnames) {
        try {
            const cnt = fs.readFileSync(file).toString();
            const { mani } = parseXMLFile(cnt);
            const forms = buildManiMetaForms(mani);

            if (mani && forms.length) {
                rv.files.push({
                    mani,
                    forms,
                    urls: [getFormUrls(forms[0]), getFormUrls(forms[1])],
                    raw: cnt,
                    fname: file,
                });
            } else {
                rv.empty.push(file);
            }
        } catch (error) {
            rv.failed.push(file);
        }
    }

    return rv;
}

// Manifest sorting

export type ByDomains = Record<string, FileMeta[]>; // domain -> manifest files

export function splitByDomains(files: FileMeta[]) {
    const rv: ByDomains = {};

    files.forEach((file) => {
        const domain = file.urls[0]?.oParts?.domain;
        if (domain) {
            !rv[domain] && (rv[domain] = []);
            rv[domain].push(file);
        }
    });

    return rv;
}

// Backup

export function makeBackupCopy(files: FileMeta[], rootFolder: string): void {
    const backupFolder = ensureNameUnique(`${rootFolder}/backup-${nowDayTime().replace(/ /g, '-')}`, false);
    osStuff.mkdirSync(backupFolder);

    files.forEach((f) => {
        if (f.raw) {
            const newFname = path.join(backupFolder, path.basename(f.fname));
            fs.writeFileSync(newFname, f.raw);
        }
    });
}

// Reports

export function printLoaded(loadedManifests: LoadedManifests) {

    loadedManifests.files.forEach((file) => {
        const [a, b] = [file.urls[0]?.oParts?.woParms, file.urls[1]?.oParts?.woParms];
        if (a || b) {
            notes.add('--------------------------------');
            a && notes.add(`    0: ${chalk.green(a)}`);
            b && notes.add(`    1: ${chalk.green(b)}`);
        }
    });

    loadedManifests.empty.forEach((file) => {
        notes.add(chalk.bgBlue.green(`empty --------------------------------${path.basename(file)}`));
    });

    loadedManifests.failed.forEach((file) => {
        notes.add(chalk.bgBlue.green(`failed --------------------------------${path.basename(file)}`));
    });
}

export type Duplicates = [domain: string, files: FileMeta[]][];

export function printDuplicates(duplicates: Duplicates) {
    const entries = duplicates.map(([key, val]) => {
        const items = val.map((item) => `\n    ${item.urls[0]?.oParts?.woParms}`).join(''); // ${item.urls[0]?.oParts?.urlPath}
        return chalk.red(`${key} ${val.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}
