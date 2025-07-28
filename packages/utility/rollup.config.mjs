import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
	input: './src/index.ts',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
    ]
};