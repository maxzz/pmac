import { ReportData } from "../../test-data";

export function Section4_GeneralInfo() {
    const version = !ReportData.reportVersion ? '' : `
        <div class="mt-4 text-[.65rem]">
            This report was generated by pmac utility version ${ReportData.reportVersion.version} on ${new Date(ReportData.reportVersion.date).toDateString()} at ${new Date(ReportData.reportVersion.date).toLocaleTimeString()}.
        </div>`;
    return `
    <div class="mt-3 text-base font-semibold">
        General info
    </div>
    <div class="mb-4">
        ${SubHeader('URL')}
        <p>
            A Uniform Resource Locator (URL), colloquially termed a web address, is a reference to a web resource that specifies
            its location on a computer network and a mechanism for retrieving it. A URL is a specific type of Uniform Resource Identifier (URI),
            although many people use the two terms interchangeably.            
        </p>
        <div class="mt-4 w-min flex flex-col">
            ${urlScheme()}
            <div class="self-center text-sm">
                ${Link('https://en.wikipedia.org/wiki/Uniform_Resource_Identifier', 'URL scheme format.')}
            </div>
        </div>
        ${SubHeader('Wildcard pattern')}
        <p>
            Wildcard pattern matching supports ${Marker('?')} as well as ${Marker('*')} where:
            <ul class="mt-1 space-y-0.5">
                <li>${Marker('?')} Matches any single character.</li>
                <li>${Marker('*')} Matches any sequence of characters (including the empty sequence).</li>
            </ul>

            <p class="mt-1">You can use the asterisk ${Marker('*')} in any URL segment to match certain patterns. For example, ${Example('example.com/t*st')} would match:</p>
            <ul class="mt-1 text-xs space-y-0.5">
                <li class="ml-6">${Example('example.com/test')}</li>
                <li class="ml-6">${Example('example.com/toast')}</li>
                <li class="ml-6">${Example('example.com/trust')}</li>
            </ul>
            <p>${Example('example.com/foo/*')} does not match ${Example('example.com/foo')} but ${Example('example.com/foo*')} does match.</p>
        </p>
        ${SubHeader('Regular expression')}
        <p>
            A regular expression (shortened as regex or regexp) is a sequence of characters that specifies a search pattern in text.
            ${Link('https://en.wikipedia.org/wiki/Regular_expression', 'More information on wikipedia.')}
        </p>
        ${version}
    </div>`;
}

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

function SubHeader(txt: string) {
    return `<h2 class="mt-2 text-sm font-semibold">${txt}</h2>`;
}

function Marker(ch: string) {
    return `<span class="px-1 font-semibold border-primary-300 border bg-primary-100/50 rounded shadow-sm">${ch}</span>`;
}

function Example(txt: string) {
    return `<span class="text-xs">${txt}</span>`;
}

function Link(href: string, txt: string) {
    return `<a class="text-blue-500 hover:underline" href="${href}" target="_blank">${txt}</a>`;
}
