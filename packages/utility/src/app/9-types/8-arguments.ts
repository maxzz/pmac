import { type ArgsFolder } from "./3-args-folder";

export type AppArgs = AppOptions & {
    dc: boolean;                // task: domain credentials (Dc)
    addPrefix: boolean;         // task: add prefix
    removePrefix: boolean;      // task: remove prefix
    argsFolders: ArgsFolder[];
};

export type AppOptions = {
    needBackup?: boolean;
    needReport?: boolean;
    needUpdate?: boolean;        // will create report if there is no --no-need-report option
    removeAny?: boolean;         // remove any not our prefixes before the guid part of filename
    generateJson?: boolean;      // private: generate local json file for template debugging
    domain?: string;             // scope of task: all files or with a specific domain only; it can be just part of domain wo/ dot character, so use regex match
}

// This is just to parse command line arguments

export type ArgTarget = {
    files: string[];
    dirs: string[];
};
