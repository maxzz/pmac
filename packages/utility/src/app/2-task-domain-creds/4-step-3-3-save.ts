import path from "path";
import fs from "fs";
import { type FileCnt, type SingleFolder } from "../9-types";
import { type FileMani, type Mani, convertToXmlString, toManiFileFormat } from "../../manifest";
import { getFileCntsFromDuplfileCnts } from "../4-common-tasks";

export function step3_3_Save(singleFolder: SingleFolder): void {
    const fileCnts: FileCnt[] = getFileCntsFromDuplfileCnts(singleFolder.duplFileCnts);
    fileCnts.forEach(
        (fileCnt) => {
            const xml = makeXML(fileCnt.mani);
            if (xml) {
                const newFname = path.join(singleFolder.rootFolder, fileCnt.relativeFname);
                fs.writeFileSync(newFname, xml);
            }
        }
    );
}

function makeXML(newMani: Mani.Manifest): string | undefined {
    try {
        const root: FileMani.Manifest = toManiFileFormat(newMani);
        const res = convertToXmlString({ mani: root });

        const { xml, error } = res;
        if (error || !xml) {
            console.error('Error converting to xml', error);
            return;
        }
        return xml;
    } catch (error) {
        return undefined;
    }
}
