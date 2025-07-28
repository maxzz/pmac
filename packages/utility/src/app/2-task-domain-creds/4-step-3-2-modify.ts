import { type Mani } from "../../manifest";
import { type SingleFolder } from "../9-types";
import { type ItemDuplicate } from "@pmac/shared-types";
import { getFileCntsFromDuplfileCnts, updateToRegexUrlsArray } from "../4-common-tasks";

export function step3_2_Modify(singleFolder: SingleFolder): void {
    const domCreds: ItemDuplicate[] = getFileCntsFromDuplfileCnts(singleFolder.duplFileCnts).map(
        (fileCnt) => {
            const newUrls = updateToRegexUrlsArray(fileCnt);
            fileCnt.mani?.forms?.forEach(
                (form: Mani.Form, idx: number) => {
                    newUrls[idx] && (form.detection.web_murl = newUrls[idx]);
                }
            );
            return {
                id: fileCnt.id, //TODO: add more to report
                urls: newUrls,
            };
        }
    );

    singleFolder.report.domcreds = {
        multiple: domCreds,
    };
}
