import { type ItemInputFile } from "./1-input-file";
import { type ItemError, type ItemDuplicate } from "./2-rest";

// Types of report item for addToReport()

export type Report_InputFiles = {
    input?: ItemInputFile[];        // input files, but it is generated somewhere, so check it where before rename it.
};

export type Report_Duplicates = {
    multiple?: ItemDuplicate[];
};

export type ReportAddParams = Report_InputFiles | Report_Duplicates;

export type ReportFileFormat = {
    root: string;
    inputs?: Report_InputFiles;
    domcreds?: Report_Duplicates;   // Domain Credentials (Dc) Duplicates; use the same creadential for the whole domain
    errors?: ItemError[];

    version: string;                // Version of utility that created this report // move these two to ReportRecords object vs. array as now
    date: number;                   // Time when report was generated
};

export type ReportsByFolder = ReportFileFormat[]; // root folder -> ReportRecord
