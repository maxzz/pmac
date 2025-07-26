export type ArgsFolder = {
    rootFolder: string;         // This group root folder
    fnames: string[];           // fnames are relative to the rootFolder wo/ the rootFolder but w/ possible sub-folders: A(InUse), B(NotInUse), and C(NotInUseTest).
};
