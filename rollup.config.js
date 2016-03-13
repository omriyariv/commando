import babel from 'rollup-plugin-babel';
import preset from 'babel-preset-es2015-rollup';

export default {
  entry: 'src/commando.js',
  dest: 'lib/commando.js',
  external: [
    'backbone',
    'underscore',
  ],
  globals: {
    backbone: 'Backbone',
    underscore: '_',
  },
  plugins: [
    babel({
      sourceMaps: true,
      presets: [preset],
      babelrc: false,
    }),
  ],
  format: 'umd',
  moduleName: 'commando',
  sourceMap: true,
};
