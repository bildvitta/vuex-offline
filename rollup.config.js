import babel from 'rollup-plugin-babel'
import remove from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'

const options = {
  format: 'esm',
  exports: 'named'
}

export default {
  external: [
    'rxdb/plugins/core',
    'rxdb/plugins/validate',
    'rxdb/plugins/query-builder',
    'rxdb/plugins/migration',
    'rxdb/plugins/replication-couchdb',
    'rxdb/plugins/leader-election',
    'rxdb/plugins/update',
    'rxdb/plugins/pouchdb',
    'rxdb/dist/es/rx-error.js'
  ],

  input: './src/index.js',

  output: [
    {
      file: 'dist/index.js',
      ...options
    },
    {
      file: 'dist/index.min.js',
      plugins: [terser()],
      sourcemap: true,
      ...options
    }
  ],

  plugins: [
    remove({ targets: 'dist/*' }),
    babel({ exclude: 'node_modules/**' })
  ]
}
