export function Section5_Footer() {
    return `
    <footer class="px-4 text-primary-200 bg-title3/50 cursor-default select-none">
        <div class="mx-auto max-w-3xl flex items-center justify-between">
            <div class="text-xs flex-1">
                © 2022 HID Global Corporation, part of ASSA ABLOY. All rights reserved.
            </div>
            <div>
                <button id="toggle-general-info" class="my-2 px-2 pt-1 pb-1.5 text-xs hover:bg-primary-600 border-primary-300 border rounded shadow active:scale-[.97]"
                    title="Show/Hide general information"
                >Show General Info</button>
                <button id="toggle-all" class="my-2 px-2 pt-1 pb-1.5 text-xs hover:bg-primary-600 border-primary-300 border rounded shadow active:scale-[.97]"
                    title="Expand/Collapse additional information about all items\nCtrl + Click to toggle open/closed items"
                >Toggle All</button>
            </div>
        </div">
    </footer>`; // Expand all
}
