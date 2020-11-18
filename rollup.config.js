import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default [
    {
        input: 'src/index.js',
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
            minify()
        ]
    },

    {
        input: 'src/index.js',
        external: ['uuid'],
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'},
        ],
    },
];
