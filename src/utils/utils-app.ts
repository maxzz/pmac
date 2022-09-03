import path from "path";
import fs from "fs";
import { buildManiMetaForms, Mani, Meta, parseXMLFile } from "../manifest";
import { notes } from "./help";
import chalk from "chalk";
import { removeQuery, tmurl, urlDomain } from "../manifest/url";

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
    oPath?: string;
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
            const org = rv.o.toLowerCase();
            const u = tmurl.url(org);
            rv.oDomain = u.domain || u.hostname || u.path || '';
            rv.oWoParms = (org || '').split('?')[0].split('#')[0].split('!')[0];
            rv.oPath = u.path;

            // separated by '!'
            // https://clientconnect.checkfree.com/wps/portal/home/cc2login/!ut/p/z1/04_sj9cpykssy0xplmnmz0vmafijo8ziawitxd0sna18_aomza0cqwmnteitniwnlmz0wwkpiajkg-aajgza_vfyldgaoauzafubupsbyvwaykzbborbpqoiigcgieac/dz/d5/l2dbisevz0fbis9nqseh/
            // https://www.parnorthamerica.biz/wps/portal/evipr/!ut/p/b0/04_sj9cpykssy0xplmnmz0vmafgjzoid_z2c3dzc_ai9hm2mdtxdjj3cwrwcdcz8dpqlsh0vauizkaa!/

            //const a = '[\!\#\$\&\'\(\)\*\+\,\/\:\;\=\?\@\[\]]';

            // !
            // #
            // $
            // &
            // '
            // (
            // )
            // *
            // +
            // ,
            // /
            // :
            // ;
            // =
            // ?
            // @
            // [
            // ]

            // rv.oDomain = urlDomain(rv.o).toLowerCase();
            // rv.oWoParms = removeQuery(rv.o).toLowerCase();
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
        const [a, b] = [file.urls[0]?.oWoParms, file.urls[1]?.oWoParms];
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
