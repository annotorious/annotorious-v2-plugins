import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import serve from 'rollup-plugin-serve';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/annotorious-tf-tag-suggestions.min.js',
    format: 'umd',
    name: 'recogito.AnnotoriousTFSuggestions',
    compact: true,
  },
  plugins: [,
    nodePolyfills(),
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    uglify(),
    serve({
      open: true,
      contentBase: ['dist', '../../public']
    })
  ]
};

export default config;