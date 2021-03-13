import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import serve from 'rollup-plugin-serve';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/annotorious-tilted-box.min.js',
    format: 'umd',
    name: 'Annotorious.TiltedBox',
    compact: true,
  },
  plugins: [,
    nodePolyfills(),
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
    serve({
      open: true,
      contentBase: ['dist', '../../public']
    })
  ]
};

export default config;