import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Meta, parseXMLFile } from "../manifest";
import { notes } from "./help";
import chalk from "chalk";
import { urlDomain } from "../manifest/url";

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

export type FileMeta = {
    mani: Mani.Manifest;
    forms: Meta.Form[];
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
                rv.files.push({ mani, forms, });
            } else {
                rv.empty.push(file);
            }
        } catch (error) {
            rv.failed.push(file);
        }
    }

    return rv;
}

export function printLoaded(loadedManifests: LoadedManifests) {

    loadedManifests.files.forEach((file) => {
        const detectionA = file?.mani?.forms?.[0]?.detection;
        const detectionB = file?.mani?.forms?.[1]?.detection;

        if (detectionA?.web_ourl || detectionB?.web_ourl) {
            notes.add('--------------------------------');
            detectionA?.web_ourl && notes.add(`    0: ${chalk.green(urlDomain(detectionA.web_ourl))}`);
            detectionB?.web_ourl && notes.add(`    1: ${chalk.green(urlDomain(detectionB.web_ourl))}`);
        }
    });

    loadedManifests.empty.forEach((file) => {
        notes.add(chalk.bgBlue.green(`empty --------------------------------${path.basename(file)}`));
    });

    loadedManifests.failed.forEach((file) => {
        notes.add(chalk.bgBlue.green(`failed --------------------------------${path.basename(file)}`));
    });
}
