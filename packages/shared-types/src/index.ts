export type FormData = {
    domain?: string;        // domain
    ourl?: string;          // original url
    murl?: string;          // match url; it will be undefined if ourl === murl or ourl === undefined
};

export type ItemInputFile = {
    id: string;             // file this run unique ID
    idx: number,            // file index from all loaded files
    title: string;          // Login form title
    urls: FormData[];       // manifest form urls
    short: string;          // Filename relative to root; const fname = path.join(f.root, f.short)
};

export type ItemDuplicate = {
    id: string;             // ItemInputFile ID
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
