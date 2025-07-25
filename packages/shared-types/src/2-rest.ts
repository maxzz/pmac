import { type ItemInputFile } from "./1-input-file";

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
    input?: ItemInputFile[]; // input files, but it is generated somewhere, so check it where before rename it.
};

export type Report_Duplicates = {
    multiple?: ItemDuplicate[];
};

export type ReportAddParams = Report_InputFiles | Report_Duplicates;

export type ReportFileFormat = {
    root: string;
    inputs?: Report_InputFiles;
    domcreds?: Report_Duplicates;
    errors?: ItemError[];

    version: string;        // Version of utility that created this report // move these two to ReportRecords object vs. array as now
    date: number;           // Time when report was generated
};

export type ReportsByFolder = ReportFileFormat[]; // root folder -> ReportRecord
