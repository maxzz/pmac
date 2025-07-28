import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: {
            pmac: 'src/index.ts',
        },
        format: ['cjs'],
        noExternal: ['pm-manifest', '@pmac/template', 'fast-xml-parser'],
    },
]);