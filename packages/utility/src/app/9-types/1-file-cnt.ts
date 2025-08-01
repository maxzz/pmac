import { type Mani, type Meta, type Matching } from "../../manifest";

export type MetaFormEx = Prettify<Meta.Form & { urls: UrlsFromForm; }>;

export type FileCnt = {
    id: string;                         // File this run unique ID
    mani: Mani.Manifest;                // Parsed manifest
    metaForms: MetaFormEx[];            // Each form meta data
    //urls: UrlsFromForm[];               // Each form urls
    rawFileContent: string;             // Loaded file content
    relativeFname: string;              // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};

export type UrlsFromForm = {
    o?: string;                         // Original url
    m?: string;                         // Match url
    oUrlSplit?: UrlSplit;
    mUrlSplit?: UrlSplit;               // Available only if mData.style === Matching.Style.makeDomainMatch i.e. string match
    mData?: Matching.RawMatchData;      // Built out of mParts
};

export type UrlSplit = {
    domain?: string;                    // Url domain
    woParms?: string;                   // Url wo/ params
    urlPath?: string;                   // Url path part wo/ domain and params
};
