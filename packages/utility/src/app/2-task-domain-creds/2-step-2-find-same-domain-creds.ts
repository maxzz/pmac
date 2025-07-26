import { type FileCnt, type SameDomainCreds, type SingleFolder } from "../9-types";
import { splitByKey } from "../../utils";
import { Matching } from "../../manifest";

/* Step 2 */

export function step2_FindSameDomainCreds(singleFolder: SingleFolder) {
    singleFolder.sameDomaincreds = getSameDomainCreds(singleFolder.files);
}

function getSameDomainCreds(fileCnts: FileCnt[]): SameDomainCreds[] {
    const byDomains = splitByKey(fileCnts,
        (fileMeta) => {
            const loginForm = fileMeta.urls?.[0];
            const loginStyle = loginForm?.mData?.how;
            
            const makeSenseToProcces = loginStyle === Matching.How.undef || loginStyle === Matching.How.makeDomainMatch;
            return makeSenseToProcces ? loginForm?.oUrlSplit?.domain : undefined;
        }
    );

    const haveSameDc = Object.entries(byDomains).filter(
        ([domain, files]) => files.length > 1
    );

    const rv = haveSameDc.map(
        ([domain, files]) => ({ domain, files })
    );

    return rv;
}
