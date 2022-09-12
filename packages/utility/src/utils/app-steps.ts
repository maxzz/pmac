import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Matching, Meta, parseXMLFile } from "../manifest";
import { notes } from "./app-notes";
import chalk from "chalk";
import { FormUrls, getFormUrls } from "./utils-mani-urls";
import { ensureNameUnique, nowDayTime, toUnix } from "./unique-names";
import { osStuff } from "./utils-os";
import { SourceGroup } from "./app-arguments";
import { addToReport, makeHtmlReport } from "./utils-report";
import { Report_Duplicates, Report_InputFiles } from "@pmac/shared-types";

// Manifest loading

export type FileMeta = {
    mani: Mani.Manifest;        // Parsed manifest
    forms: Meta.Form[];         // Each form meta data
    urls: FormUrls[];           // Each form urls
    raw: string;                // Loaded file content
    short: string;              // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short)
};

export type DcActive = {        // Domain Credentials Duplicates
    domain: string;
    files: FileMeta[];
};

export type TargetGroup = {
    root: string;               // this group root source folder
    backupFolder?: string;      // folder for backup
    files: FileMeta[];          // loaded meaninfull files, i.e. wo/ empty and failed
    dcActive: DcActive[];       // duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    empty: string[];            // filename list of empty files
    failed: string[];           // filename list of failed to load files
};

function loadManifests(sourceGroup: SourceGroup): TargetGroup {
    const rv: TargetGroup = { root: sourceGroup.root, files: [], dcActive: [], empty: [], failed: [] };

    for (const file of sourceGroup.fnames) {
        const fname = path.join(sourceGroup.root, file);
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

export function getDcActive(files: FileMeta[]): DcActive[] {
    type ByDomains = Record<string, FileMeta[]>; // domain -> manifest files
    type Duplicate = [domain: string, files: FileMeta[]];

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
        
    const byDomains = splitByDomains(files);

    const domainsArr: Duplicate[] = Object.entries(byDomains);
    const duplicates = domainsArr.filter(([key, val]) => val.length > 1);

    const dcActive = duplicates.map(([domain, files]) => ({ domain, files }));
    return dcActive;
}

function flatDcActive(dcActive: DcActive[]): FileMeta[] {
    const files: FileMeta[] = dcActive.map(({domain, files}) => files).flat();
    return files;
}

// Backup

function makeBackupCopy(files: FileMeta[], rootFolder: string): void {
    const backupFolder = ensureNameUnique(`${rootFolder}/backup-${nowDayTime().replace(/ /g, '-')}`, false);
    osStuff.mkdirSync(backupFolder);

    files.forEach((f) => {
        if (f.raw) {
            const fname = path.join(rootFolder, f.short);
            const maybeSubFolder = path.dirname(fname);
            osStuff.mkdirSync(maybeSubFolder);

            const newFname = path.join(backupFolder, path.basename(fname));
            fs.writeFileSync(newFname, f.raw);
        }
    });
}

// Local console log reports

export function printLoaded(targetGroup: TargetGroup) {

    targetGroup.files.forEach((file) => {
        const [a, b] = [file.urls[0]?.oParts?.woParms, file.urls[1]?.oParts?.woParms];
        if (a || b) {
            notes.add('--------------------------------');
            a && notes.add(`    0: ${chalk.green(a)}`);
            b && notes.add(`    1: ${chalk.green(b)}`);
        }
    });

    targetGroup.empty.forEach((file) => {
        notes.add(chalk.bgBlue.green(`empty --------------------------------${path.basename(file)}`));
    });

    targetGroup.failed.forEach((file) => {
        notes.add(chalk.bgBlue.green(`failed --------------------------------${path.basename(file)}`));
    });
}

export function printDcActive(dcActive: DcActive[]) {
    const entries = dcActive.map(({ domain, files }) => {
        const items = files.map((item) => `\n    ${item.urls[0]?.oParts?.woParms}`).join('');
        return chalk.red(`${domain} ${files.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}

// Steps

export function step_LoadManifests(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = loadManifests(sourceGroup);
    //printLoaded(targetGroup);

    const toReport: Report_InputFiles = {
        input: targetGroup.files.map((f) => ({
            title: f.forms[0]?.mani?.options?.choosename || '',
            root: toUnix(targetGroup.root),
            short: toUnix(f.short),
        })),
    };
    addToReport(targetGroup.root, { inputs: toReport, });

    return targetGroup;
}

export function step_SetDcActive(targetGroup: TargetGroup) {
    targetGroup.dcActive = getDcActive(targetGroup.files);


    //TODO: move away from here
    //TODO: and add to report
    if (targetGroup.dcActive.length) {
        printDcActive(targetGroup.dcActive);
    } else {
        notes.add(`\nNothing done:\nThere are no duplicates in ${targetGroup.files.length} loaded file${targetGroup.files.length === 1 ? '' : 's'}.`);
    }
}

export function step_MakeBackupCopy(targetGroup: TargetGroup): void {
    try {
        const dcActive: FileMeta[] = flatDcActive(targetGroup.dcActive);
        makeBackupCopy(dcActive, targetGroup.root);
    } catch (error) {


        //TODO: move away from here
        throw new Error(`Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${targetGroup.root}`);
    }
}

export function step_ModifyDuplicates(targetGroup: TargetGroup): void {

    //was: (duplicates: Duplicate[])

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

export function step_MakeReport(targetGroup: TargetGroup): void {

    const toReport: Report_Duplicates = {
        multiple: flatDcActive(targetGroup.dcActive).map((file) => ({
            file: file.short, //TODO: add more to report
        })),
    };
    addToReport(targetGroup.root, { domcreds: toReport, });

    const report = makeHtmlReport(targetGroup.root);

    if (report) {
        //TODO: save it into the same folder
        console.log('newTemplate\n', report);
    }

    notes.add(`All done in folder ${targetGroup.root}`);
}
