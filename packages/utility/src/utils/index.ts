export { ensureNameUnique, exist, nowDayTime, toUnix } from "./unique-names";
export { uuid } from "./uuid";
export { OsStuff } from "./utils-os";
export { splitByKey } from "./utils";
export { getFormUrlsArray, filterFilesByDomain, reportFormUrlsArray } from "./utils-mani-urls";

export { exitProcess, newErrorArgs } from './utils-errors';

export { templateStr } from "./utils-report-template";

import picocolors from 'picocolors';
export const color = picocolors;
