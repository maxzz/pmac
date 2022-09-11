
export type ItemInputFile = {
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
    duplicates?: ItemDuplicate[];
};

export type Report = {
    inputs?: ItemInputFile[];
    duplicates?: ItemDuplicate[];
};

export type ReportRecords = Report_InputFiles | Report_Duplicates;
