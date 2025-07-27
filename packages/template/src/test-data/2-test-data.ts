import { type ReportsByFolder } from "@pmac/shared-types";
import jsonData from "./test-data-private.json";

if (process.env.NODE_ENV !== 'production') {

    const testReports: ReportsByFolder = jsonData;
    (window as any)['tmReport'] = testReports;

    console.log('only dev report', testReports);
}

export const reports: ReportsByFolder = getReports();

function getReports(): ReportsByFolder {
    let rv = (window as any)['tmReport'] as ReportsByFolder;
    if (typeof rv === 'string') { // there is no rawRepopts from window.tmReport and rv is "__INJECTED__DATA__"
        rv = [];
    }
    return rv;
}
