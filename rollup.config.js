import babel from 'rollup-plugin-babel'
import remove from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'

const options = {
  format: 'umd',
  name: 'VuexOffline'
}

export default {
  input: './index.js',

  output: [
    { file: 'dist/index.js', ...options },
    { file: 'dist/index.min.js', sourcemap: true, ...options }
  ],

  plugins: [
    remove({ targets: 'dist/*' }),
    babel({ exclude: 'node_modules/**' }),
    terser({ include: [/^.+\.min\.js$/] })
  ]
}
