import { type FileCnt, type DuplFileCnts, type SingleFolder } from "../9-types";
import { splitByKey } from "../../utils";
import { Matching } from "../../manifest";

/* Step 2 */

export function step2_FindSameDomainCreds(singleFolder: SingleFolder) {
    singleFolder.duplFileCnts = getDuplFileCnts(singleFolder.fileCnts);
}

function getDuplFileCnts(fileCnts: FileCnt[]): DuplFileCnts[] {
    const domainToFileCtns = splitByKey(fileCnts,
        (fileCnt) => {
            const loginUrls = fileCnt.metaForms[0]?.urls;
            const loginHow = loginUrls?.mData?.how;
            
            const makeSenseToProcces = loginHow === Matching.How.undef || loginHow === Matching.How.makeDomainMatch;
            return makeSenseToProcces ? loginUrls?.oUrlSplit?.domain : undefined;
        }
    );

    const haveSameDc = Object.entries(domainToFileCtns).filter(
        ([domain, fileCnts]) => fileCnts.length > 1
    );

    const rv = haveSameDc.map(
        ([domain, fileCnts]) => ({ domain, fileCnts })
    );

    return rv;
}
