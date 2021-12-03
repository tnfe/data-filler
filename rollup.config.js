import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
  }),
]
let umdOutput = {
  format: 'umd',
  name: 'data-filler',
  file: 'dist/data-filler.js',
};

if (process.env.MIN === 'true') {
  plugins.push(terser());
  umdOutput.file = 'dist/data-filler.min.js';
}

module.exports = {
  input: 'src/index.ts',
  plugins,
  output: [
    umdOutput,
  ],
};