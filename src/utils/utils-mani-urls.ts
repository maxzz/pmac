import { Mani, Matching, Meta } from "../manifest";
import { tmurl } from "../manifest/url";

export type FormUrlParts = {
    domain?: string;    // original url domain
    woParms?: string;   // original url wo/ params
    urlPath?: string;   // original url path
};

export type FormUrls = {
    o?: string;         // original url
    m?: string;         // match url
    oParts?: FormUrlParts;
    mParts?: FormUrlParts; // available only if mData.style === Matching.Style.makeDomainMatch i.e. string match  
    mData?: Matching.RawMatchData; // built out of mParts
};

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
