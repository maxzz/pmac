export type ItemInputFile = {
    id: string;             // File this run unique ID
    idx: number,            // File index from all loaded files
    title: string;          // Login form title
    urls: FormUrls[];       // Manifest form urls
    short: string;          // Filename relative to TargetGroup.root; const fname = path.join(f.root, f.short); it can be also 'c/filename.dpm'
};

export type FormUrls = {
    domain?: string;        // Form domain
    ourl?: string;          // Form original url
    oWoP?: string;          // Form original url wo/ params if ourl !== oWoP
    murl?: string;          // Form match url; it will be undefined if ourl === murl or ourl === undefined
};
