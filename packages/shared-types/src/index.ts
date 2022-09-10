export type Report_InputFiles = {
    input?: {
        file: string;
    }[];
};

export type Report_Duplicates = {
    duplicates?: {
        file: string;
    }[];
};

export type Report = {
    inputs?: Report_InputFiles;
    duplicates?: Report_Duplicates;
};
