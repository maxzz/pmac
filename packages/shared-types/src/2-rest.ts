import { type ItemInputFile } from "./1-input-file";

export type ItemDuplicate = {
    id: string;                     // ItemInputFile ID
    urls: string[];                 // Manifest form new modified urls //TODO: change to object vs. [undefined, url] -> filter(Boolean)
};

export type ItemError = {
    text: string;                   // Error message text
    isError?: boolean;              // Is error or information
};
