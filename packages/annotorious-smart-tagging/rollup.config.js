import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/annotorious-smart-tagging.js',
    format: 'umd',
    name: 'recogito.AnnotoriousSmartTagging',
    compact: true,
  },
  plugins: [,
    babel({ babelHelpers: 'bundled' }),
    uglify()
  ]
};

export default config;