export type ArgTarget = {
    files: string[];
    dirs: string[];
};

export type RootGroup = {
    root: string;               // this group root folder
    fnames: string[];           // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};

export type AppOptions = {
    needBackup?: boolean;
    needReport?: boolean;
    needUpdate?: boolean;        // will create report if there is no --no-need-report option
    removeAny?: boolean;         // remove any not our prefixes before the guid part of filename
    generateJson?: boolean;      // private: generate local json file for template debugging
    domain?: string;             // scope of task: all files or with a specific domain only; it can be just part of domain wo/ dot character, so use regex match
}

export type AppArgs = AppOptions & {
    dc: boolean;                // task: domain credentials
    addPrefix: boolean;         // task: add prefix
    removePrefix: boolean;      // task: remove prefix
    rootGroups: RootGroup[];
};
