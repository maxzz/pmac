function urlScheme() {
    return `
        <div class="px-2 w-min whitespace-pre font-mono text-xs bg-primary-100/50 shadow border-primary-300 border rounded cursor-default">
                       host                         
                 ┌──────┴──────┐                    
        userinfo │     domain  │ port
        ┌──┴───┐ │   ┌────┴────┐ ┌┴┐
https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top
└─┬─┘   └───────────┬──────────────┘└───────┬───────┘ └───────────┬─────────────┘ └┬┘
scheme          authority                  path                 query           fragment
        </div>`;
} //first-letter:text-3xl first-letter:font-bold

export function Section4_GeneralInfo() {
    return `
        <div class="mt-3 text-lg font-semibold">
            General info
        </div>
        <div class="mb-4">
            <h2 class="mt-2 text-base font-semibold">
                URL
            </h2>
            <p>
                A Uniform Resource Locator (URL), colloquially termed a web address, is a reference to a web resource that specifies
                its location on a computer network and a mechanism for retrieving it. A URL is a specific type of Uniform Resource Identifier (URI),
                although many people use the two terms interchangeably.            
            </p>
            <div class="mt-4 w-min flex flex-col">
                ${urlScheme()}
                <div class="self-center text-sm text-blue-500 hover:underline">
                    <a href="https://en.wikipedia.org/wiki/Uniform_Resource_Identifier" target="_blank">URL scheme format.</a>
                </div>
            </div>

            <h2 class="mt-4 text-base font-semibold">
                Wildcard pattern
            </h2>
            <p>
                Wildcard pattern matching supports '?' as well as '*' where:
                <ul>
                    <li><span class="px-1 font-semibold bg-primary-200/50 rounded">'?'</span> Matches any single character.</li>
                    <li><span class="px-1 font-semibold bg-primary-200/50 rounded">'*'</span> Matches any sequence of characters (including the empty sequence).</li>
                </ul>
                <!-- <a class="text-blue-500 hover:underline" href="https://en.wikipedia.org/wiki/Regular_expression" target="_blank">More information on wikipedia.</a> -->
            </p>

            <h2 class="mt-4 text-base font-semibold">
                Regular expression
            </h2>
            <p>
                A regular expression (shortened as regex or regexp) is a sequence of characters that specifies a search pattern in text.
                <a class="text-blue-500 hover:underline" href="https://en.wikipedia.org/wiki/Regular_expression" target="_blank">More information on wikipedia.</a>
            </p>

        </div>`;
}

function updateGeneralInfoBtnText() {
    const info = document.getElementById('general-info');
    const toggle = document.getElementById('toggle-general-info');
    const text = `${info?.classList.contains('hidden') ? 'Show' : 'Hide'} General Info`;
    toggle && (toggle.innerText = text);
}

export function generalInfoClick(el: HTMLElement) {
    el.addEventListener('click', () => {
        const info = document.getElementById('general-info');
        info?.classList.toggle('hidden');
        if (!info?.classList.contains('hidden')) {
            info?.scrollIntoView();
        }
        updateGeneralInfoBtnText();
    });
}
