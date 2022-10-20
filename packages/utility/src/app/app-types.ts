export type Targets = {
    files: string[];
    dirs: string[];
};

export type RealArgs = {
    dc: boolean;
    addPrefix: boolean;
    removePrefix: boolean;
    targets: Targets;
};

export type SourceGroup = {
    root: string;       // this group root folder
    fnames: string[];   // fnames relative to the root wo/ the root but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};
