import { type FileMeta, type SameDomainCreds, type TargetGroup } from "../9-types";
import { splitByKey } from "../../utils";
import { Matching } from "../../manifest";

/* Step 2 */

export function step2_FindSameDomainCreds(targetGroup: TargetGroup) {
    targetGroup.sameDomaincreds = getSameDomainCreds(targetGroup.files);
}

function getSameDomainCreds(files: FileMeta[]): SameDomainCreds[] {
    const byDomains = splitByKey(files,
        (fileMeta) => {
            const loginForm = fileMeta.urls?.[0];
            const loginStyle = loginForm?.mData?.how;
            
            const makeSenseToProcces = loginStyle === Matching.How.undef || loginStyle === Matching.How.makeDomainMatch;
            return makeSenseToProcces ? loginForm?.oParts?.domain : undefined;
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
