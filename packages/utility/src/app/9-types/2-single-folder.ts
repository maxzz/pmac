import { type ReportFileFormat } from "@pmac/shared-types";
import { type FileCnt } from "./1-file-cnt";

export type SingleFolder = {             // Single folder as a target Group
    rootFolder: string;                  // This group root source folder
    fileCnts: FileCnt[];                 // Loaded meaninfull files, i.e. wo/ empty and failed
    fnamesEmpty: string[];               // Filenames of empty files
    fnamesFailed: string[];              // Filenames of failed to load files
    backupFolder: string;                // Folder for backup
    duplFileCnts: DuplFileCnts[];        // Duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    report: ReportFileFormat;            // Report for this group
};

export type DuplFileCnts = {             // Domain Credentials (Dc) Duplicates; they use the same domain creadential for the whole domain
    domain: string;
    fileCnts: FileCnt[];
};
