import pkg from './package.json';
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
        input: 'src/main.js',
        external: ['uuid'],
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'}
        ],
        plugins: [
            commonjs(),
        ]
    }
];
