export type ReportFormUrls = {
    domain?: string;        // Form domain
    ourl?: string;          // Form original url
    oWoP?: string;          // Form original url wo/ params if ourl !== oWoP
    murl?: string;          // Form match url; it will be undefined if ourl === murl or ourl === undefined
};

export type ItemInputFile = {
    id: string;             // File this run unique ID
    idx: number,            // File index from all loaded files
    title: string;          // Login form title
    urls: ReportFormUrls[]; // Manifest form urls
    short: string;          // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};

export type ItemDuplicate = {
    id: string;             // ItemInputFile ID
    urls: string[];         // Manifest form new modified urls //TODO: change to object vs. [undefined, url] -> filter(Boolean)
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
    version: string;        // version of utility that created this report
};

export type ReportRecords = Report[]; // root folder -> ReportRecord
