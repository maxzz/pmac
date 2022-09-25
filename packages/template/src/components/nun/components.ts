export function H1({text}: {text: string}) {
    return `<h1 class="text-lg font-semibold" title="List of all files">${text}</h1>`;
}

export function Para({text}: {text: string}) {
    return `<p class="">${text}</p>`;
}

export function Button({ id, text = '' }: { id: string, text?: string; }) {
    return `
    <button class="px-3 pt-1 pb-2 
        bg-primary-300/30 border-primary-700 hover:bg-primary-300/70 shadow active:scale-[.97] border rounded transition-all" 
        id="${id}" type="button">${text}
    </button>`;
}
