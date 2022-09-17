function IconHIDLogo() {
    return `
        <svg viewBox="0 0 125 33.4" class="p-2 w-12 md:w-20 fill-title5" stroke="currentColor" strokeWidth={0.2} fill="none">
            <path d="M79.96 33.16V.25c10.24 0 20.24-.68 30.09.2a16.09 16.09 0 0 1 15 16.47c0 8.41-5.76 15.23-15.27 16.05-9.75.84-19.58.19-29.82.19ZM96.22 3.21v27.07c6.61 1.08 9.56-.46 10.37-6.29a51.35 51.35 0 0 0 .06-13.9c-.87-6.28-3.5-7.74-10.43-6.88ZM0 32.8V.29h15.89v13.92h12V.34h16.05V32.7H28.03V19.31H16.11V32.8ZM54.24 32.86V.39h15.65v32.47Z" />
        </svg>`;
}

export const textShadow = "text-shadow: 1px 1px 2px #000";
export const elevation4Shadow = "box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%)";

export function PageHeader() {
    return `
    <div>
        <header class="px-6 py-4 flex items-center justify-between bg-title3 shadow-sm cursor-default select-none">
            <div class="flex items-center space-x-4">
                <a target="_blank" href="https://www.hidglobal.com" tabIndex="-1">
                    <div class="flex items-center justify-center bg-primary-300 rounded-md">
                        ${IconHIDLogo()}
                    </div>
                </a>
                <h1 class="flex items-center text-sm md:text-xl tracking-tighter font-light text-slate-100 whitespace-normal sm:whitespace-nowrap" title="Password Manager Administrator Command Report" style="${textShadow}" >
                    <div class="inline-block">DigitalPersona</div><div class="-mt-1 mr-1 text-sm">&#174;</div>
                    <div class="block md:hidden">PMAC</div>
                    <div class="hidden md:block">Password Manager Administrator Command</div>
                    <div class="ml-1">Report</div>
                </h1>
            </div>
        </header>
        <div class="h-1 bg-title5" style="${elevation4Shadow}"></div>
    </div>
        `;
}
