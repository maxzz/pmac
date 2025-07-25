import { AllSectionsTemplate, AddClickListeners_UpdatedFiles, AddClickListeners_Footer, toggleItems } from "./components";
import "../index.css";

function createAppFragment() {
    const allSectionsHtml = AllSectionsTemplate();
    
    const rv = document.createDocumentFragment();
    const div = document.createElement('div');
    div.id = 'app';
    div.innerHTML = allSectionsHtml;
    rv.append(div);

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
    
    AddClickListeners_UpdatedFiles(appFragment);
    AddClickListeners_Footer(appFragment, appState);

    document.querySelector<HTMLDivElement>('#app')!.replaceWith(appFragment);

    if (process.env.NODE_ENV !== 'production') {
        //To debug tailwind screens:
        //document.querySelector<HTMLDivElement>('#app')!.classList.add('debug-screens');

        //To debug expand all at start:
        //document.getElementById('toggle-general-info')?.click();
        
        //To debug start toggled:
        appState.expanded = true, toggleItems({ setOpen: true });
    }
}

main();
