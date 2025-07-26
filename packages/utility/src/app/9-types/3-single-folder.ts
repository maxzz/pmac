import { type ReportFileFormat } from "@pmac/shared-types";
import { type FileCnt } from "./2-mani-loading";

export type SingleFolder = {             // Single folder as a target Group
    rootFolder: string;                  // This group root source folder
    files: FileCnt[];                   // Loaded meaninfull files, i.e. wo/ empty and failed
    fnamesEmpty: string[];               // Filenames of empty files
    fnamesFailed: string[];              // Filenames of failed to load files
    backupFolder: string;                // Folder for backup
    sameDomaincreds: SameDomainCreds[];  // Duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    report: ReportFileFormat;            // Report for this group
};

export type SameDomainCreds = {          // Domain Credentials (Dc) Duplicates; use the same creadential for the whole domain
    domain: string;
    files: FileCnt[];
};
