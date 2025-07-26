import { type Mani, type Meta, type Matching } from "../../manifest";

// Manifest loading

export type FormUrlParts = {
    domain?: string;                    // original url domain
    woParms?: string;                   // original url wo/ params
    urlPath?: string;                   // original url path part wo/ domain and params
};

export type FormUrls = {
    o?: string;                         // original url
    m?: string;                         // match url
    oParts?: FormUrlParts;
    mParts?: FormUrlParts;              // available only if mData.style === Matching.Style.makeDomainMatch i.e. string match
    mData?: Matching.RawMatchData;      // built out of mParts
};

export type FileMeta = {
    id: string;                         // File this run unique ID
    mani: Mani.Manifest;                // Parsed manifest
    forms: Meta.Form[];                 // Each form meta data
    urls: FormUrls[];                   // Each form urls
    raw: string;                        // Loaded file content
    short: string;                      // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};
