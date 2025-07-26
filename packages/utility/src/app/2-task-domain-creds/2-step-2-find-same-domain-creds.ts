import { type FileCnt, type DuplFileCnts, type SingleFolder } from "../9-types";
import { splitByKey } from "../../utils";
import { Matching } from "../../manifest";

/* Step 2 */

export function step2_FindSameDomainCreds(singleFolder: SingleFolder) {
    singleFolder.duplFileCnts = getDuplFileCnts(singleFolder.fileCnts);
}

function getDuplFileCnts(fileCnts: FileCnt[]): DuplFileCnts[] {
    const byDomains = splitByKey(fileCnts,
        (fileMeta) => {
            const loginForm = fileMeta.urls?.[0];
            const loginStyle = loginForm?.mData?.how;
            
            const makeSenseToProcces = loginStyle === Matching.How.undef || loginStyle === Matching.How.makeDomainMatch;
            return makeSenseToProcces ? loginForm?.oUrlSplit?.domain : undefined;
        }
    );

    const haveSameDc = Object.entries(byDomains).filter(
        ([domain, fileCnts]) => fileCnts.length > 1
    );

    const rv = haveSameDc.map(
        ([domain, fileCnts]) => ({ domain, fileCnts })
    );

    return rv;
}
