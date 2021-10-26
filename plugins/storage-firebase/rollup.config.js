import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/recogito-firebase-storage.js',
    format: 'umd',
    name: 'recogito.FirebaseStorage',
    compact: true,
  },
  plugins: [,
    babel({ babelHelpers: 'bundled' }),
    uglify()
  ]
};

export default config;