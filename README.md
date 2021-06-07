# Vuex Offline

VuexOffline is a generic Vuex store module for working offline with rxDB.

## Install

```bash
$ npm i @bildvitta/vuex-offline
```

```js
import VuexOffline, { createUUID, createDateTime } from 'vuex-offline'

const offline = new VuexOffline({
  idKey: 'uuid',

  database: { // rxDB database settings https://rxdb.info/rx-database.html#pouchSettings
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

## Module default

```js
export default {
  name: '', // collection name, must be snake_case

  // Database
  schema: {}, // check rxDB docs https://rxdb.info/rx-schema.html#example

  // Defaults
  defaults: {}, // default value when create a new document
  updateDefaults: {}, // default value when update a document (NEVER update a "primary" field, like "uuid" or "id")

  // Asteroid
  idKey: 'id', // key to identify the primary field of schema
  perPage: 12, // quantity of items to show per page

  sort: {},
  relationships: {}, // relationships to display as options inside fields
  fields: {}, // check API docs https://github.com/bildvitta/api
  filters:{}, // check asteroid docs https://asteroid.nave.dev/?path=/docs/components-filters--default

  // Vuex modules, it can add or replace the current modules.
  actions: {},
  getters: {},
  mutations: {},
  state: {},
}
```

## Users module example

```js
export default {
  name: 'users',

  // Database
  schema: {
    title: 'Users schema',
    version: 0,
    type: 'object',
    properties: {
      uuid: {
        type: 'string',
        primary: true
      },

      name: {
        type: 'string'
      },

      email: {
        type: 'string'
      },

      address: {
        type: 'string',
        minLength: 1
      },

      posts: {
        type: 'array',
        ref: 'posts', // must exists a "posts" collection
        items: {
          type: 'string'
        }
      },

      createdAt: {
        type: 'string',
        format: 'date-time'
      },

      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    },

    required: [
      'name',
      'email',
      'address',
      'createdAt',
      'updatedAt'
    ],

    indexes: ['createdAt']
  },

  sort: { createdAt: 'asc' }, // sort by createdAt

  // Defaults
  defaults: {
    uuid: createUUID, // field "uuid" will have random uuid
    createdAt: createDateTime // field "createdAt" will have parsed date now value
    updatedAt: createDateTime // field "updatedAt" will have parsed date now value
  },

  updateDefaults: {
    updatedAt: createDateTime // field "updatedAt" will have parsed date now value
  },

  // Asteroid
  idKey: 'uuid',
  perPage: 12,

  relationships: { // will get dynamic relations
    posts: {
      ref: 'posts',
      label: 'title', // key for display in q-select as label, in this case, field "title" inside "posts"
      value: 'uuid' // // key for display in q-select as value, in this case, field "uuid" inside "posts"
    }
  },

  fields: {
    name: {
      name: 'name',
      type: 'text',
      label: 'Nome',
    },

    email: {
      name: 'email',
      type: 'email',
      label: 'E-mail',
    },

    address: {
      name: 'address',
      type: 'text',
      label: 'Endereço',
    },

    posts: {
      name: 'posts',
      type: 'select',
      multiple: true,
      label: 'Posts',
    }
  },

  filters: { // check asteroid docs https://asteroid.nave.dev/?path=/docs/components-filters--default
    fields: {
      name: {
        name: 'name',
        type: 'text',
        label: 'Nome'
      },

      email: {
        name: 'email',
        type: 'text',
        label: 'E-mail'
      }
    }

    queryOperators: { // check mangoquery docs https://github.com/cloudant/mango
      email: '$eq',
      name: value => ({ value: `.*${value}.*`, operator: '$regex' })
    },

    search: ['name'] // it will search for field "name"
  },

  // Vuex
  actions: {},
  getters: {},
  mutations: {},
  state: {},
}
```
