export type Targets = {
    files: string[];
    dirs: string[];
};

export type SourceGroup = {
    root: string;       // this group root folder
    fnames: string[];   // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};

export type AppArgs = {
    dc: boolean;
    addPrefix: boolean;
    removePrefix: boolean;
    sourceGroups: SourceGroup[];
    domain?: string;    // scope of task: all files or with a specific domain only
};
