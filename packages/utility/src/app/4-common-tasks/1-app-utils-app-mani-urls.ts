import { type FormUrls } from "@pmac/shared-types";
import { type Meta, Matching, tmurl } from "../../manifest";
import { type FileCnt, type UrlsFromForm } from "../../app/9-types";

export function getFormUrls(form: Meta.Form | undefined): UrlsFromForm {
    const rv: UrlsFromForm = {};
    const detection = form?.mani?.detection;
    if (detection) {
        rv.o = detection.web_ourl;
        rv.m = detection.web_murl;
        if (rv.o) {
            const org = rv.o.toLowerCase();
            const u = tmurl.url(org);
            rv.oUrlSplit = {
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
                rv.mUrlSplit = {
                    domain: u.domain || u.hostname || u.path || '',
                    woParms: (org || '').split('?')[0].split('#')[0].split('!')[0],
                    urlPath: u.path,
                };
            }
        }
    }
    return rv;
}

export function reportFormUrlsArray(fileCnt: FileCnt): FormUrls[] {
    return [
        reportFormUrls(fileCnt, 0),
        reportFormUrls(fileCnt, 1),
    ].filter(Boolean);

    function reportFormUrls(fileCnt: FileCnt, formIdx: number): FormUrls | undefined {
        const parts = fileCnt.metaForms[formIdx]?.urls;
        const oWoP = parts?.o?.toLowerCase() === parts?.oUrlSplit?.woParms?.toLowerCase() ? undefined : parts?.oUrlSplit?.woParms;
        // if (oWoP) {
        //     console.log(`${color.green('ourl')} ${parts?.o}`);
        //     console.log(`${color.gray('oWoP')} ${oWoP}`);
        // }
        return parts?.o ? {
            domain: parts?.oUrlSplit?.domain,
            ourl: parts?.o,
            ...(oWoP && { oWoP }),
            ...(parts?.o !== parts?.m && { murl: parts?.m }),
        } : undefined;
    }
}

// Filter by domain

export function filterFilesByDomain(fileCnts: FileCnt[], domain?: string): FileCnt[] {
    return domain ? fileCnts.filter(matchedDomain) : fileCnts;

    function matchedDomain(fileCnt: FileCnt): boolean {
        return fileCnt.metaForms.some(
            (metaForm) => metaForm.urls.oUrlSplit?.domain === domain
        ); // I'm not sure if we need here false positive matches w/ regex.
    }
}
