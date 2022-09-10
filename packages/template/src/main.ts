import '../index.css';
import { setupCounter } from './counter';
import { setupHeader } from './header';
//import { Report, Report_InputFiles } from '@pmac/shared-types';
import { report } from './test-data';

const typescriptLogo = '';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML =
    `
  <div class="flex-1 bg-gradient-to-t from-primary-50 to-[#036eb3] text-primary-900">
    <header id="header"></header>

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

setupHeader(document.querySelector<HTMLButtonElement>('#header')!)

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

console.log('report', report);
