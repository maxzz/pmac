import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Meta, parseXMLFile } from "../manifest";
import { notes } from "./help";
import chalk from "chalk";
import { removeQuery, urlDomain } from "../manifest/url";

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

type FormUrls = {
    o?: string;
    m?: string;
    oDomain?: string;
    oWoParms?: string;
};

export type FileMeta = {
    mani: Mani.Manifest;
    forms: Meta.Form[];
    urls: FormUrls[];
};

export type LoadedManifests = {
    files: FileMeta[];
    empty: string[];
    failed: string[];
};

function getFormUrls(form: Meta.Form | undefined): FormUrls {
    const rv: FormUrls = {};
    const detection = form?.mani?.detection;
    if (detection) {
        rv.o = detection.web_ourl;
        rv.m = detection.web_murl;
        if (rv.o) {
            rv.oDomain = urlDomain(rv.o);
            rv.oWoParms = removeQuery(rv.o);
        }
    }
    return rv;
}

export function loadManifests(fnames: string[]): LoadedManifests {
    const rv: LoadedManifests = { files: [], empty: [], failed: [], };

    for (const file of fnames) {
        try {
            const cnt = fs.readFileSync(file).toString();
            const { mani } = parseXMLFile(cnt);
            const forms = buildManiMetaForms(mani);

            if (mani && forms.length) {
                rv.files.push({ mani, forms, urls: [getFormUrls(forms[0]), getFormUrls(forms[1])] });
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
        if (file.urls[0]?.oWoParms || file.urls[1]?.oWoParms) {
            notes.add('--------------------------------');
            file.urls[0].oWoParms && notes.add(`    0: ${chalk.green(file.urls[0].oWoParms)}`);
            file.urls[1].oWoParms && notes.add(`    1: ${chalk.green(file.urls[1].oWoParms)}`);
        }
    });

    loadedManifests.empty.forEach((file) => {
        notes.add(chalk.bgBlue.green(`empty --------------------------------${path.basename(file)}`));
    });

    loadedManifests.failed.forEach((file) => {
        notes.add(chalk.bgBlue.green(`failed --------------------------------${path.basename(file)}`));
    });
}
