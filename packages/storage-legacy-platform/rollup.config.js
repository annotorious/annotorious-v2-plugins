import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/recogito-legacy-storage.js',
    format: 'umd',
    name: 'recogito.LegacyStorage',
    compact: true,
  },
  plugins: [,
    babel({ babelHelpers: 'bundled' }),
    uglify()
  ]
};

export default config;