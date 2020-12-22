import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/recogito-legacy-storage.js',
    format: 'umd',
    name: 'recogito.LegacyStorage',
    compact: true,
  },
  plugins: [,
    nodePolyfills(),
    nodeResolve(),
    json(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    uglify()
  ]
};

export default config;