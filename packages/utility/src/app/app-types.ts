import { Mani, Matching, Meta } from "../manifest";
import { Report } from "@pmac/shared-types";

export type Targets = {
    files: string[];
    dirs: string[];
};

export type SourceGroup = {
    root: string;               // this group root folder
    fnames: string[];           // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};

export type AppOptions = {
    noBackup?: boolean;
    noReport?: boolean;
    noUpdate?: boolean;         // will create report if there is no --no-report option
    domain?: string;            // scope of task: all files or with a specific domain only; it can be just part of domain wo/ dot character, so use regex match
}

export type AppArgs = AppOptions & {
    dc: boolean;                // task: domain credentials
    addPrefix: boolean;         // task: add prefix
    removePrefix: boolean;      // task: remove prefix
    sourceGroups: SourceGroup[];
};

// Manifest loading

export type FormUrlParts = {
    domain?: string;    // original url domain
    woParms?: string;   // original url wo/ params
    urlPath?: string;   // original url path part wo/ domain and params
};

export type FormUrls = {
    o?: string;         // original url
    m?: string;         // match url
    oParts?: FormUrlParts;
    mParts?: FormUrlParts; // available only if mData.style === Matching.Style.makeDomainMatch i.e. string match  
    mData?: Matching.RawMatchData; // built out of mParts
};

export type FileMeta = {
    id: string;                 // File this run unique ID
    mani: Mani.Manifest;        // Parsed manifest
    forms: Meta.Form[];         // Each form meta data
    urls: FormUrls[];           // Each form urls
    raw: string;                // Loaded file content
    short: string;              // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};

export type SameDc = {          // Domain Credentials Duplicates; use the same creadential for the whole domain
    domain: string;
    files: FileMeta[];
};

export type TargetGroup = {
    root: string;               // this group root source folder
    files: FileMeta[];          // loaded meaninfull files, i.e. wo/ empty and failed
    empty: string[];            // filename list of empty files
    failed: string[];           // filename list of failed to load files
    backup: string;             // folder for backup
    sameDc: SameDc[];           // duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    report: Report;             // report for this group
};
