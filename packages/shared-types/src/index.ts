export type FormData = {
    ourl: string;
    murl?: string;
};

export type ItemInputFile = {
    title: string;          // Login form title
    root: string;           // Group folder
    short: string;          // Filename relative to root; const fname = path.join(f.root, f.short)
};

export type ItemDuplicate = {
    file: string;
};

export type Report_InputFiles = {
    input?: ItemInputFile[];
};

export type Report_Duplicates = {
    multiple?: ItemDuplicate[];
};

export type Report = {
    inputs?: Report_InputFiles;
    domcreds?: Report_Duplicates;
};

