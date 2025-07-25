import { AllSectionsTemplate, Section3_UpdatedFiles_Events, Section5_Footer_Events } from "./components";
import "../index.css";

function createAppFragment() {
    const allSectionsHtml = AllSectionsTemplate();
    
    const rv = document.createDocumentFragment();
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    appDiv.innerHTML = allSectionsHtml;
    rv.append(appDiv);

    return rv;
}

export type AppState = {
    expanded: boolean;
};

function main() {
    const appState: AppState = {
        expanded: false,
    };

    const appFragment = createAppFragment();
    Section3_UpdatedFiles_Events(appFragment);
    Section5_Footer_Events(appFragment, appState);

    document.querySelector<HTMLDivElement>('#app')!.replaceWith(appFragment);

    if (process.env.NODE_ENV !== 'production') {
        document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');
        //document.getElementById('toggle-general-info')?.click();
        //appState.expanded = true, toggleItems({ setOpen: true });
    }
}

main();
