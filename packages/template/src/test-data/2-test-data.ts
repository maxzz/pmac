import { type ReportsByFolder } from "@pmac/shared-types";
import jsonData from "./test-data-private.json";

if (process.env.NODE_ENV !== 'production') {

    const testReports: ReportsByFolder = jsonData;
    console.log('only dev report', testReports);

    (window as any)['tmReport'] = testReports;
}

export const reports: ReportsByFolder = (window as any)['tmReport'];