import '../index.css';
import { setupCounter } from './counter';
import { AllFiles } from '@pmac/shared-types';

const typescriptLogo = '';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML =
    `
  <div class="flex-1 bg-gradient-to-t from-blue-500 to-blue-400">

    <a href="https://vitejs.dev" target="_blank">
      <!-- <img src="/vite.svg" class="logo" alt="Vite logo" /> -->
    </a>

    <a href="https://www.typescriptlang.org/" target="_blank">
      <!-- <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" /> -->
    </a>

    <h1>Vite + TypeScript</h1>

    <div class="card">
      <button class="px-2 p-1 border-primary-700 border rounded" id="counter" type="button"></button>
    </div>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>

  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

const reportData = (window as any)['reportData'] as AllFiles;

console.log('got it', reportData);
