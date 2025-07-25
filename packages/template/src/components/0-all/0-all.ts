import { Section1_Header } from "./1-section-header";
import { Section2_About } from "./2-section-about";
import { Section3_UpdatedFiles } from "./3-section-updated-files";
import { Section4_GeneralInfo } from "./4-section-general-info";
import { Section5_Footer } from "./5-section-footer";

export function AllSectionsTemplate() {
    return `
    <div class="h-full text-sm text-sky-800 grid grid-rows-[auto_minmax(0,1fr)_auto]">
        ${Section1_Header()}
        <div class="w-full h-full overflow-auto">
            <div class="mx-auto md:w-max h-full grid grid-rows-[auto_1fr]">
                ${Section2_About()}
                <div>
                    <main id="report-table">
                        ${Section3_UpdatedFiles()}
                    </main>
                    <div class="pb-4 px-4 max-w-[80ch] animate-slide-down hidden" id="general-info">
                        ${Section4_GeneralInfo()}
                    </div>
                </div>
            </div>
        </div>
        ${Section5_Footer()}
    </div>`;
}
