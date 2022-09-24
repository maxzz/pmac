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
}

export function Section4_GeneralInfo() {
    return `
        <div class="mt-2 mb-2 text-lg font-semibold">
            General info
        </div>
        <div class="mb-4">
            <p class="first-letter:text-3xl first-letter:font-bold">
                URL. A Uniform Resource Locator (URL), colloquially termed a web address, is a reference to a web resource that specifies
                its location on a computer network and a mechanism for retrieving it. A URL is a specific type of Uniform Resource Identifier (URI),
                although many people use the two terms interchangeably.            
            </p>
            <div class="mt-4 w-min flex flex-col">
                ${urlScheme()}
                <div class="self-center text-sm text-sky-700 underline">
                    <a href="https://en.wikipedia.org/wiki/Uniform_Resource_Identifier" target="_blank">URL scheme format</a>
                </div>
            </div>
            <p class="first-letter:text-3xl first-letter:font-bold">
                A regular expression (shortened as regex or regexp) is a sequence of characters that specifies a search pattern in text.
                <a class="underline" href="https://en.wikipedia.org/wiki/Regular_expression" target="_blank">More information on wikipedia.</a>
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
