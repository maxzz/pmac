export type FormData = {
    ourl: string;
    murl?: string;
};

export type ItemInputFile = {
    id: string;             // file this run unique ID
    title: string;          // Login form title
    short: string;          // Filename relative to root; const fname = path.join(f.root, f.short)
};

export type ItemDuplicate = {
    file: string;
};

export type ItemError = {
    text: string;           // Error message text
    isError?: boolean;      // Is error or information
};

// Types of report item for addToReport()

export type Report_InputFiles = {
    input?: ItemInputFile[];
};

export type Report_Duplicates = {
    multiple?: ItemDuplicate[];
};

export type ReportAddParams = Report_InputFiles | Report_Duplicates;

export type Report = {
    root: string;
    inputs?: Report_InputFiles;
    domcreds?: Report_Duplicates;
    errors?: ItemError[];
};

export type ReportRecords = Report[]; // root folder -> ReportRecord
