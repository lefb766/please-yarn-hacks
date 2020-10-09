import babel from '@rollup/plugin-babel';
import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: './index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
    },
    plugins: [
        babel(),
        commonJs(),
        nodeResolve(),
    ]
}
