import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Matching, Meta, parseXMLFile } from "../manifest";
import { notes } from "./app-notes";
import chalk from "chalk";
import { FormUrls, getFormUrls } from "./utils-mani-urls";
import { ensureNameUnique, nowDayTime, toUnix } from "./unique-names";
import { osStuff } from "./utils-os";
import { TargetGroup } from "./app-arguments";
import { addToReport, makeHtmlReport } from "./utils-report";

// Manifest loading

export type FileMeta = {
    mani: Mani.Manifest;    // Parsed manifest
    forms: Meta.Form[];     // Each form meta data
    urls: FormUrls[];       // Each form urls
    raw: string;            // Loaded file content
    root: string;           // Group folder
    short: string;          // Filename relative to root; const fname = path.join(f.root, f.short)
    //fname: string;
};

export type LoadedManifests = {
    files: FileMeta[];
    empty: string[];
    failed: string[];
};

function loadManifests(targetGroup: TargetGroup): LoadedManifests {
    const rv: LoadedManifests = { files: [], empty: [], failed: [], };

    for (const file of targetGroup.fnames) {
        const fname = path.join(targetGroup.root, file);
        try {
            const cnt = fs.readFileSync(fname).toString();
            const { mani } = parseXMLFile(cnt);
            const forms = buildManiMetaForms(mani);

            if (mani && forms.length) {
                rv.files.push({
                    mani,
                    forms,
                    urls: [getFormUrls(forms[0]), getFormUrls(forms[1])],
                    raw: cnt,
                    root: targetGroup.root,
                    short: file,
                });
            } else {
                rv.empty.push(fname);
            }
        } catch (error) {
            rv.failed.push(fname);
        }
    }

    return rv;
}

// Manifest sorting

export type ByDomains = Record<string, FileMeta[]>; // domain -> manifest files
export type Duplicate = [domain: string, files: FileMeta[]];

function splitByDomains(files: FileMeta[]): ByDomains {
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

export function getDuplicates(files: FileMeta[]): Duplicate[] {
    const byDomains = splitByDomains(files);

    const domainsArr: Duplicate[] = Object.entries(byDomains);
    const duplicates = domainsArr.filter(([key, val]) => val.length > 1);

    return duplicates;
}

function flatDuplicates(duplicates: Duplicate[]): FileMeta[] {
    const files: FileMeta[] = duplicates.map(([domain, files]) => files).flat();
    return files;
}

// Backup

function makeBackupCopy(files: FileMeta[], rootFolder: string): void {
    const backupFolder = ensureNameUnique(`${rootFolder}/backup-${nowDayTime().replace(/ /g, '-')}`, false);
    osStuff.mkdirSync(backupFolder);

    files.forEach((f) => {
        if (f.raw) {
            const fname = path.join(f.root, f.short);
            const maybeSubFolder = path.dirname(fname);
            osStuff.mkdirSync(maybeSubFolder);

            const newFname = path.join(backupFolder, path.basename(fname));
            fs.writeFileSync(newFname, f.raw);
        }
    });
}

// Local console log reports

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

export function printDuplicates(duplicates: Duplicate[]) {
    const entries = duplicates.map(([key, val]) => {
        const items = val.map((item) => `\n    ${item.urls[0]?.oParts?.woParms}`).join('');
        return chalk.red(`${key} ${val.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}

// Steps

export function step_LoadManifests(targetGroup: TargetGroup): LoadedManifests {
    const loadedManifests = loadManifests(targetGroup);
    //printLoaded(loadedManifests);

    const toReport = {
        input: loadedManifests.files.map((f) => ({
            root: toUnix(f.root),
            short: toUnix(f.short),
        })),
    };
    addToReport(toReport);

    return loadedManifests;
}

export function step_GetDuplicates(files: FileMeta[]): Duplicate[] | undefined {
    const duplicates = getDuplicates(files);

    //TODO: add to report

    if (duplicates.length) {
        printDuplicates(duplicates);
    } else {
        notes.add(`\nNothing done:\nThere are no duplicates in ${files.length} loaded file${files.length === 1 ? '' : 's'}.`);
    }

    return duplicates.length ? duplicates : undefined;
}

export function step_MakeBackupCopy(duplicates: Duplicate[], rootFolder: string): void {
    try {
        makeBackupCopy(flatDuplicates(duplicates), rootFolder);
    } catch (error) {
        throw new Error(`Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${rootFolder}`);
    }
}

export function step_ModifyDuplicates(duplicates: Duplicate[]): void {

    // const destFolder = ensureNameUnique(`${targetGroup.root}/new ${nowDayTime()}`, false);
    // osStuff.mkdirSync(destFolder);
    // loadedManifests.files.forEach((f) => {
    //     const xml = makeXML(f.mani);
    //     if (xml) {
    //         const newFname = path.join(destFolder, f.short);
    //         fs.writeFileSync(newFname, xml);
    //         //const newDir = path.join(f.short, 'new');
    //         //const newFname = path.join(newDir, f.short);
    //         // const newFname = path.join(newDir, path.basename(f.short, path.extname(f.fname)) + '_new') + path.extname(f.fname);
    //         //osStuff.mkdirSync(newDir);
    //         //fs.writeFileSync(newFname, xml);
    //     }
    // });

    //TODO: place modified files into original folder

}

export function step_MakeReport(duplicates: Duplicate[], rootFolder: string): void {

    const toReport = {
        duplicates: flatDuplicates(duplicates).map((file) => ({
            file: file.short, //TODO: add more to report
        })),
    };
    addToReport(toReport);

    const report = makeHtmlReport(rootFolder);

    if (report) {
        //TODO: save it into the same folder
        console.log('newTemplate', report);
    }

    notes.add(`All done in folder ${rootFolder}`);
}
