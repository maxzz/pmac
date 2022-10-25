import { ReportFormUrls } from "@pmac/shared-types";
import { FileMeta, FormUrls } from "../app/app-types";
import { Mani, Matching, Meta } from "../manifest";
import { tmurl } from "../manifest/url";

export function getFormUrls(form: Meta.Form | undefined): FormUrls {
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
            rv.mData = Matching.getMatchRawData(rv.m.toLowerCase()); // TODO: lowerCase maybe not good for regex
            if (rv.mData.style === Matching.Style.makeDomainMatch) { // i.e. string match 
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

export function reportFormUrls(f: FileMeta, idx: number): ReportFormUrls | undefined {
    const parts = f.urls[idx];
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
