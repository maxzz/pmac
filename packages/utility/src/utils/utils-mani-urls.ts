import { FormUrls } from "../app/app-types";
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
