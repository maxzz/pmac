import path from "path";
import fs from "fs";
import chalk from "chalk";
import { buildManiMetaForms, makeXML, Mani, Matching, Meta, parseXMLFile } from "../manifest";
import { FormUrls, getFormUrls } from "../utils/utils-mani-urls";
import { uuid } from "../utils/uuid";
import { osStuff } from "../utils/utils-os";
import { ensureNameUnique, nowDayTime, toUnix } from "../utils/unique-names";
import { notes } from "./app-notes";
import { SourceGroup } from "./app-arguments";
import { templateStr } from "../utils/utils-report-template";
import { ItemError, ReportFormUrls, Report, ReportRecords } from "@pmac/shared-types";
import { splitByKey } from "../utils/utils";
import { programVersion } from "./app-help";

// Manifest loading

export type FileMeta = {
    id: string;                 // File this run unique ID
    mani: Mani.Manifest;        // Parsed manifest
    forms: Meta.Form[];         // Each form meta data
    urls: FormUrls[];           // Each form urls
    raw: string;                // Loaded file content
    short: string;              // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};

export type SameDc = {          // Domain Credentials Duplicates; use the same creadential for the whole domain
    domain: string;
    files: FileMeta[];
};

export type TargetGroup = {
    root: string;               // this group root source folder
    backup: string;             // folder for backup
    sameDc: SameDc[];           // duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    files: FileMeta[];          // loaded meaninfull files, i.e. wo/ empty and failed
    empty: string[];            // filename list of empty files
    failed: string[];           // filename list of failed to load files
    report: Report;             // report for this group
};

// Manifest sorting

function flatDcActive(sameDC: SameDc[]): FileMeta[] {
    const files: FileMeta[] = sameDC.map(({ domain, files }) => files).flat();
    return files;
}

// Errors

function addError(targetGroup: TargetGroup, msg: ItemError | string) {
    const errors = targetGroup.report.errors || (targetGroup.report.errors = []);
    errors.push(typeof msg === 'string' ? { text: msg } : msg);
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

export function printDcActive(sameDC: SameDc[]) {
    const entries = sameDC.map(({ domain, files }) => {
        const items = files.map((item) => `\n    ${item.urls[0]?.oParts?.woParms}`).join('');
        return chalk.red(`${domain} ${files.length}${items}`);
    });

    entries.forEach((item) => {
        console.log(item);
    });
}

// Steps

export function step1_LoadManifests(sourceGroup: SourceGroup): TargetGroup {
    const targetGroup = loadManifests(sourceGroup);
    //printLoaded(targetGroup);

    targetGroup.report.inputs = {
        input: targetGroup.files.map((f, idx) => {
            const urls = [formUrls(f, 0), formUrls(f, 1)].filter(Boolean);
            return {
                id: f.id,
                idx,
                urls,
                title: f.forms[0]?.mani?.options?.choosename || '',
                short: toUnix(f.short),
            };
        }),
    };

    return targetGroup;

    function loadManifests(sourceGroup: SourceGroup): TargetGroup {
        const rv: TargetGroup = {
            root: sourceGroup.root,
            backup: path.join(sourceGroup.root, 'temp'),  // later it will be replaced by a more suitable one
            files: [],
            sameDc: [],
            empty: [],
            failed: [],
            report: { root: '', version: programVersion, },
        };

        for (const file of sourceGroup.fnames) {
            const fname = path.join(sourceGroup.root, file);
            try {
                const cnt = fs.readFileSync(fname).toString();
                const { mani } = parseXMLFile(cnt);
                const forms = buildManiMetaForms(mani);

                if (mani && forms.length) {
                    rv.files.push({
                        id: uuid(),
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

    function formUrls(f: FileMeta, idx: number): ReportFormUrls | undefined {
        const parts = f.urls[idx];
        const oWoP = parts?.o?.toLowerCase() === parts?.oParts?.woParms?.toLowerCase() ? undefined : parts?.oParts?.woParms;
        // if (oWoP) {
        //     console.log(`${chalk.green('ourl')} ${parts?.o}`);
        //     console.log(`${chalk.gray('oWoP')} ${oWoP}`);
        // }
        return parts?.o ? {
            domain: parts?.oParts?.domain,
            ourl: parts?.o,
            ...(oWoP && { oWoP }),
            ...(parts?.o !== parts?.m && { murl: parts?.m }),
        } : undefined;
    }

} //step1_LoadManifests()

export function step2_FindSameDc(targetGroup: TargetGroup) {
    function getSameDc(files: FileMeta[]): SameDc[] {
        const byDomains = splitByKey(files, (fileMeta) => {
            const loginForm = fileMeta.urls?.[0];
            const loginStyle = loginForm?.mData?.style;
            const makeSenseToProcces = loginStyle === Matching.Style.undef || loginStyle === Matching.Style.makeDomainMatch;
            return makeSenseToProcces ? loginForm?.oParts?.domain : undefined;
        });

        const haveSameDc = Object.entries(byDomains).filter(([domain, files]) => files.length > 1);

        const sameDC = haveSameDc.map(([domain, files]) => ({ domain, files }));
        return sameDC;
    }

    targetGroup.sameDc = getSameDc(targetGroup.files);
}

function final1_MakeBackupCopy(targetGroup: TargetGroup): void {

    function makeBackupCopy(files: FileMeta[], destFolder: string): void {
        osStuff.mkdirSync(destFolder);
        files.forEach((f) => {
            const fname = path.join(destFolder, f.short);
            const maybeSubFolder = path.dirname(fname);
            osStuff.mkdirSync(maybeSubFolder);
            fs.writeFileSync(fname, f.raw);
        });
    }

    try {
        const sameDC: FileMeta[] = flatDcActive(targetGroup.sameDc);
        makeBackupCopy(sameDC, targetGroup.backup);
    } catch (error) {
        addError(targetGroup, {
            text: `Nothing done:\nCannot create backup: the destination path is too long or there is not enough permissions.\nFolder:\n${targetGroup.root}`,
            isError: true,
        });
        throw error;
    }
}

function final2_Modify(targetGroup: TargetGroup): void {

    function modifyUrl(url: string | undefined): string | undefined {
        return url && Matching.makeRawMatchData({ style: Matching.Style.regex, opt: Matching.Options.pmacSet, url }, '');
    }

    targetGroup.report.domcreds = {
        multiple: flatDcActive(targetGroup.sameDc).map((file) => {
            const newUrls = [
                modifyUrl(file.urls?.[0].m),
                modifyUrl(file.urls?.[1].m),
            ].filter(Boolean);
            return {
                id: file.id, //TODO: add more to report
                urls: newUrls,
            };
        }),
    };
}

function final3_Save(targetGroup: TargetGroup): void {

    //was: (duplicates: Duplicate[])

    // const destFolder = ensureNameUnique(`${targetGroup.root}/new ${nowDayTime()}`, false);
    // osStuff.mkdirSync(destFolder);

    const destFolder = targetGroup.root;

    flatDcActive(targetGroup.sameDc).forEach((f) => {

        const xml = makeXML(f.mani);
        if (xml) {
            const newFname = path.join(destFolder, f.short);
            fs.writeFileSync(newFname, xml);


            //const newDir = path.join(f.short, 'new');
            //const newFname = path.join(newDir, f.short);
            // const newFname = path.join(newDir, path.basename(f.short, path.extname(f.fname)) + '_new') + path.extname(f.fname);
            //osStuff.mkdirSync(newDir);
            //fs.writeFileSync(newFname, xml);
        }
    });

    //TODO: place modified files into original folder

}

function final4_FinalMakeReport(targetGroup: TargetGroup): void {

    function makeHtmlReport(targetGroup: TargetGroup): string | undefined {
        if (Object.keys(targetGroup.report).length) {
            const dataStr = JSON.stringify(targetGroup.report, null, 4);

            console.log('dataStr:\n', dataStr); // to debug template project

            return templateStr.replace('"__INJECTED__DATA__"', dataStr);
        }
    }

    const report: ReportRecords = [{ ...targetGroup.report, root: toUnix(targetGroup.root) }];
    const reportStr = JSON.stringify(report, null, 4);
    console.log('dataStr:\n', reportStr);

    const fname = path.join(targetGroup.backup, 'report.html');
    const cnt = templateStr.replace('"__INJECTED__DATA__"', reportStr);
    fs.writeFileSync(fname, cnt);
}

export function step3_SaveResult(targetGroup: TargetGroup): void {
    if (targetGroup.sameDc.length) {
        try {
            targetGroup.backup = ensureNameUnique(`${targetGroup.root}/backup-${nowDayTime().replace(/ /g, '-')}`, false);

            final1_MakeBackupCopy(targetGroup);
            final2_Modify(targetGroup);
            // final3_Save(targetGroup);
            final4_FinalMakeReport(targetGroup);
        } catch (error) {
        }
    }
}

export function step4_FinalMakeReport(targetGroups: TargetGroup[]): void {

    const report: ReportRecords = targetGroups.map((targetGroup) => ({ ...targetGroup.report, root: toUnix(targetGroup.root) }));
    const dataStr = JSON.stringify(report, null, 4);
    console.log('dataStr:\n', dataStr);
    templateStr.replace('"__INJECTED__DATA__"', dataStr);

    // function makeHtmlReport(targetGroup: TargetGroup): string | undefined {
    //     if (Object.keys(targetGroup.report).length) {
    //         const dataStr = JSON.stringify(targetGroup.report, null, 4);
    //         console.log('dataStr:\n', dataStr);
    //         return templateStr.replace('"__INJECTED__DATA__"', dataStr);
    //     }
    // }
    //
    // targetGroups.forEach((targetGroup) => {
    //     const report = makeHtmlReport(targetGroup);
    //
    //     if (targetGroup.sameDc.length) {
    //         printDcActive(targetGroup.sameDc);
    //     } else {
    //         notes.add(`\nNothing done:\nThere are no duplicates in ${targetGroup.files.length} loaded file${targetGroup.files.length === 1 ? '' : 's'}.`);
    //     }
    //
    //     if (report) {
    //         //TODO: save it into the same folder
    //         //console.log('newTemplate\n', report);
    //         console.log(chalk.gray(`newTemplate: ${report.substring(0, 100).replace(/\r?\n/g, ' ')}`));
    //     }
    //
    //     notes.add(`All done in folder ${targetGroup.root}`);
    // });

    notes.add(`All done`);
}

//TODO: add version to HID icon hover in the template project
