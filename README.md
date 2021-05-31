# Vuex Offline

## Install

```bash
$ npm i @bildvitta/vuex-offline
```

```js
import VuexOffline from 'vuex-offline'

const offline = new VuexOffline({
  idKey: 'uuid',

  database: {
    name: 'vxoff'
  },

  modules: [
    posts,
    users,
    categories
  ]
})

await offline.createDatabase()
await offline.setupCollections()
```

In your Vuex definition, import store modules:

```js
new Vuex.Store({
  modules: {
    ...offline.getStoreModules()
  }
})
```

## Module

```js
export default {
  name: '',

  // Database
  schema: {},

  // Defaults
  defaults: {},
  updateDefaults: {},

  // Asteroid
  idKey: 'id',
  perPage: 12,

  sort: {},
  relationships: {},
  fields: {},
  filters:{},

  // Vuex
  actions: {},
  getters: {},
  mutations: {},
  state: {},
}
```