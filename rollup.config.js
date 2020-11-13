import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/main.js',
        external: ['uuid'],
        output: {
            name: 'csg-device',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
            }),
        ]
    },

    {
        input: 'src/main.js',
        external: ['uuid'],
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'},
        ],
    },
];
