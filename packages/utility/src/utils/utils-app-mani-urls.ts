import { ReportFormUrls } from "@pmac/shared-types";
import { FileMeta, FormUrls } from "../app-types";
import { Matching, Meta } from "../manifest";
import { tmurl } from "../manifest";

function getFormUrls(form: Meta.Form | undefined): FormUrls {
    const rv: FormUrls = {};
    const detection = form?.mani?.detection;
    if (detection) {
        rv.o = detection.web_ourl;
        rv.m = detection.web_murl;
        if (rv.o) {
            const org = rv.o.toLowerCase();
            const u = tmurl.url(org);
            rv.oParts = {
                domain: u.domain || u.hostname || u.path || '',
                woParms: (org || '').split('?')[0].split('#')[0].split('!')[0],
                urlPath: u.path,
            };
        }
        if (rv.m) {
            rv.mData = Matching.parseRawMatchData(rv.m.toLowerCase()); // TODO: lowerCase maybe not good for regex
            if (rv.mData.how === Matching.How.makeDomainMatch) { // i.e. string match 
                const org = rv.mData.url;
                const u = tmurl.url(org);
                rv.mParts = {
                    domain: u.domain || u.hostname || u.path || '',
                    woParms: (org || '').split('?')[0].split('#')[0].split('!')[0],
                    urlPath: u.path,
                };
            }
        }
    }
    return rv;
}

export function getFormUrlsArray(forms: Meta.Form[]): FormUrls[] {
    return [getFormUrls(forms[0]), getFormUrls(forms[1])];
}

function reportFormUrls(fileMeta: FileMeta, idx: number): ReportFormUrls | undefined {
    const parts = fileMeta.urls[idx];
    const oWoP = parts?.o?.toLowerCase() === parts?.oParts?.woParms?.toLowerCase() ? undefined : parts?.oParts?.woParms;
    // if (oWoP) {
    //     console.log(`${color.green('ourl')} ${parts?.o}`);
    //     console.log(`${color.gray('oWoP')} ${oWoP}`);
    // }
    return parts?.o ? {
        domain: parts?.oParts?.domain,
        ourl: parts?.o,
        ...(oWoP && { oWoP }),
        ...(parts?.o !== parts?.m && { murl: parts?.m }),
    } : undefined;
}

export function reportFormUrlsArray(fileMeta: FileMeta): ReportFormUrls[] {
    return [reportFormUrls(fileMeta, 0), reportFormUrls(fileMeta, 1)].filter(Boolean);
}

// Filter by domain

export function filterFilesByDomain(files: FileMeta[], domain?: string): FileMeta[] {
    return domain ? files.filter(matchedDomain) : files;
    
    function matchedDomain(fileMeta: FileMeta): boolean {
        return fileMeta.urls.some((formUrls) => formUrls.oParts?.domain === domain); // I'm not sure if we need here false positive matches w/ regex.
    }
}

export function updateToRegexUrlsArray(fileMeta: FileMeta): string[] {

    function modifyUrl(url: string | undefined): string | undefined {
        return url && Matching.stringifyRawMatchData({ how: Matching.How.regex, opt: Matching.Options.pmacSet, url }, '');
    }

    return [modifyUrl(fileMeta.urls?.[0].m), modifyUrl(fileMeta.urls?.[1].m),].filter(Boolean);
}
