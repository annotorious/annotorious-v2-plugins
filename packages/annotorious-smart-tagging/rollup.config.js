import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/annotorious-smart-tagging.js',
    format: 'umd',
    name: 'recogito.AnnotoriousSmartTagging',
    compact: true,
  },
  plugins: [,
    nodePolyfills(),
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    uglify()
  ]
};

export default config;