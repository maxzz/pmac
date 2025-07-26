import { type ReportFileFormat } from "@pmac/shared-types";
import { type FileMeta } from "./2-mani-loading";

export type SameDomainCreds = {          // Domain Credentials (Dc) Duplicates; use the same creadential for the whole domain
    domain: string;
    files: FileMeta[];
};

export type TargetGroup = {
    root: string;                        // this group root source folder
    files: FileMeta[];                   // loaded meaninfull files, i.e. wo/ empty and failed
    empty: string[];                     // filename list of empty files
    failed: string[];                    // filename list of failed to load files
    backup: string;                      // folder for backup
    sameDomaincreds: SameDomainCreds[];  // duplicates: multiple files with the same domain credentials; i.e. where domain creds are active
    report: ReportFileFormat;            // report for this group
};
