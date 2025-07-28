import { type Mani, Matching } from "../../manifest";
import { type FileCnt, type SingleFolder } from "../9-types";
import { type ItemDuplicate } from "@pmac/shared-types";
import { getFileCntsFromDuplfileCnts } from "../4-common-tasks";

export function step3_2_Modify(singleFolder: SingleFolder): void {
    const domCreds: ItemDuplicate[] = getFileCntsFromDuplfileCnts(singleFolder.duplFileCnts).map(
        (fileCnt) => {
            const newUrls = [
                markAsModifyedUrl(fileCnt.metaForms[0]?.urls?.m),
                markAsModifyedUrl(fileCnt.metaForms[1]?.urls?.m),
            ].filter(Boolean);

            fileCnt.mani?.forms?.forEach(
                (form: Mani.Form, formIdx: number) => {
                    newUrls[formIdx] && (form.detection.web_murl = newUrls[formIdx]);
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

function markAsModifyedUrl(url: string | undefined): string | undefined {
    return url && Matching.stringifyRawMatchData(
        {
            how: Matching.How.regex,
            opt: Matching.Options.pmacSet,
            url,
        },
        '' // TODO: should it be original url?
    );
}
