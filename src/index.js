import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { getRxStoragePouch, addPouchPlugin, PouchDB } from 'rxdb/plugins/pouchdb'
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump'

import { actions, getters, mutations, state } from './module/index.js'

import { find, findOne, nestField, findByIds } from './utils/index.js'
import { createDateTime, createUUID } from './defaults/index.js'

// custom replication
import { replicateRxCollection } from 'rxdb/plugins/replication'

let database = null

export default class {
  constructor (options = {}) {
    if (!options.database.name) {
      throw new Error('Name is required.')
    }

    const validStorages = ['idb', 'memory']
    this.storage = options.storage || 'idb'

    if (!validStorages.includes(this.storage)) {
      throw new Error(`Invalid storage: ${this.storage}. Valid values are: ${validStorages.join(', ')}.`)
    }

    this.database = null
    this.databaseOptions = options.database

    this.idKey = options.idKey || 'id'
    this.sync = options.sync
    this.perPage = options.perPage || 12

    this.collections = {}
    this.modules = options.modules || []
    this.storeModules = {}

    // Middleware-hooks
    // https://rxdb.info/middleware.html
    this.hooks = options.hooks || [
      'preInsert',
      'postInsert',
      'preSave',
      'postSave',
      'preRemove',
      'postRemove',
      'postCreate'
    ]

    this.interceptors = options.interceptors || {
      postSaveByAction: (() => {})
    }

    // Types
    this.types = options.types || [
      'CREATE',
      'DESTROY',
      'FETCH_FILTERS',
      'FETCH_LIST',
      'FETCH_SINGLE',
      'REPLACE',
      'UPDATE'
    ]
  }

  addDatabasePlugin (...plugins) {
    for (const plugin of plugins) {
      addRxPlugin(plugin)
    }
  }

  addDatabasePouchPlugin (...plugins) {
    for (const plugin of plugins) {
      addPouchPlugin(plugin)
    }
  }

  async createDatabase () {
    // Custom Build
    // https://rxdb.info/custom-build.html
    this.addDatabasePlugin(
      RxDBValidatePlugin,
      RxDBQueryBuilderPlugin,
      RxDBMigrationPlugin,
      RxDBReplicationCouchDBPlugin,
      RxDBLeaderElectionPlugin,
      RxDBUpdatePlugin,
      RxDBJsonDumpPlugin
    )

    this.addDatabasePouchPlugin(
      require('pouchdb-adapter-http'),
      this._getStorageAdapterPlugin()
    )

    if (process.env.DEBUGGING) {
      this.addDatabasePlugin(
        require('rxdb/plugins/dev-mode').RxDBDevModePlugin
      )
    }

    this.database = await createRxDatabase({
      storage: getRxStoragePouch(this.storage),
      ...this.databaseOptions
    })

    database = this.database
  }

  destroyDatabase () {
    return this.database.destroy()
  }

  removeDatabase () {
    return this.database.remove()
  }

  async setupCollections () {
    const collections = {}

    for (const module of this.modules) {
      collections[module.name] = module
    }

    this.collections = await this.database.addCollections(collections)

    for (const module of this.modules) {
      this.storeModules[module.name] = this.createStoreModule(module)
    }
  }

  createStoreModule (module = {}) {
    module.parent = this
    const collection = this.getCollectionByName(module.name)

    module.idKey = module.idKey || this.idKey
    module.perPage = module.perPage || this.perPage

    // Hooks
    const hooks = module.hooks || {}

    for (const name of this.hooks) {
      const hook = hooks[name]

      if (Array.isArray(hook)) {
        collection[name](...hook)
      } else if (typeof hook === 'function') {
        collection[name](hook, false)
      }
    }

    // Types
    const types = module.types || this.types
    const has = type => types.includes(type)

    // Params
    const params = [module, collection, this.interceptors]

    return {
      namespaced: true,

      actions: {
        create: has('CREATE') && actions.create(...params),
        destroy: has('DESTROY') && actions.destroy(...params),
        fetchFilters: has('FETCH_FILTERS') && actions.fetchFilters(...params),
        fetchList: has('FETCH_LIST') && actions.fetchList(...params),
        fetchSingle: has('FETCH_SINGLE') && actions.fetchSingle(...params),
        replace: has('REPLACE') && actions.replace(...params),
        update: has('UPDATE') && actions.update(...params),
        ...module.actions
      },

      getters: getters(...params),
      mutations: mutations(...params),
      state: state(...params)
    }
  }

  getCollections () {
    return this.collections
  }

  getCollectionByName (name) {
    return this.collections[name]
  }

  getStoreModules () {
    return this.storeModules
  }

  async makeSync (collections) {
    console.log('vai syncar')
    const collectionsToSync = collections || Object.keys(this.collections)

    for (const collectionIndex in collectionsToSync) {
      const collectionName = collectionsToSync[collectionIndex]

      const moduleByName = this.modules.find(module => module.name === collectionName)
      const moduleOptions = (moduleByName.sync && moduleByName.sync.options) || {}
      const syncOptions = { ...this.sync.options, ...moduleOptions }

      if (!syncOptions.baseURL) {
        throw new Error('baseURL is required to sync.')
      }

      const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5M2Y1MmRlMC0xYmViLTQ2ODYtODZiOC0xMjdjMWNjZDIzNGYiLCJqdGkiOiJiZTYzYzg1NTA4YzJkZWU2OTA2OGU3MTM0OTE3MzlkNWEzZWIxMmRiOWI5OTM2YTNiNjA2ZTMwMGZjYTdkZDI5ZTljNzdmMjdmOTc1MGE0ZiIsImlhdCI6MTY0NTQ3MDUzMy41NTg2MDcsIm5iZiI6MTY0NTQ3MDUzMy41NTg2MTUsImV4cCI6MTY3NzAwNjUzMy41MTg0NzYsInN1YiI6IjEyIiwic2NvcGVzIjpbInByb2ZpbGUiXX0.BxigcMwQp8RRls6wn7VN-e4JjUmY5F6Rg-m1jBhg_rTBaOlvdqexXwqG8Q6MRo8hvp83wjUkd5OLCNqaskg-Hu5TM61DzF2imIurc4T1VgryPNdKhuXG7nNhq_FPgF3R0FknrwVCBR5T7uBEgp8olRijoAwcKGxoG1miMw_CR40U54AHRjiKs60rlmB9IOUR4wqbdLvfuzSklY97xACGoWosQcqrMcuRZ5NiD_ya_5NKrKrdKFgMWoVx_1n9LBxljuX4AIQ3jTaro01_fIdL6FMwqXBy-Oc084oQ1wwfDpWVn7rjnKWDj-X1m_1gF6iFuqJocd04rs53mqUFa8pBtBODSzfQMuWE6SAOpCS2srgT6CtrFdBR2yQlwG9m7QOd9L5FYqZAFdNJAxFmDStxxd1-oJZeTmrceoOWOYxhiTpq07ZmP166NPvAZ3kapHEzSQW5xYPh7QqtoCAcyQCVhRXIB-WkebksaAg7JJII4HHvr1B-jTzfea6hD31k3D9rdE-fYYuSWNUIs-wxeJKXib3tVjLZxv4kTvzHnf7xZn9MeK8b6X3Nxgzn3D-VNhgTSJGGD9yiaZBUnd4LEPjiPjGMqqFwJ0jqpS6SWgnTTIwCCCf8PyrXZM1bYypCO6qSdlhSpDIaLg2zPaxn8ZZxi-xdm-lq6IjhSlsBoDEhLsk'

      const offsets = {}

      const syncState = await replicateRxCollection({
        collection: this.collections[collectionName],
        replicationIdentifier: `my-custom-rest-replication-${collectionName}`,
        live: true,
        liveInterval: 10000,
        retryTime: 10000,
        pull: {
          async handler() {
            const latestOffset = offsets[collectionName] || 0
            const limitPerPull = 100
            const response = await fetch(
              `https://localhost:3000/api/sync/clayton/?limit=${limitPerPull}&offset=${latestOffset}`,
              {
                headers: {
                  Authorization: token,
                  Accept: 'application/json'
                }
              }
            )
  
            const documentsFromRemote = await response.json()
            offsets[collectionName] = documentsFromRemote.offset

            return {
                documents: documentsFromRemote.docs,
                hasMoreDocuments: documentsFromRemote.docs.length === limitPerPull
            };
          }
        },
        // push: {
        //   async handler(documents) {
        //     const rawResponse = await fetch(
        //       'https://localhost:3000/api/sync/clayton', 
        //       {
        //         method: 'POST',
        //         body: JSON.stringify({ documents }),
        //         headers: {
        //           Authorization: token,
        //           Accept: 'application/json',
        //           'Content-Type': 'application/json'
        //         }
        //       }
        //     )
        //     const content = await rawResponse.json()

        //     console.log(content, '<---- content')
        //   },
        //   batchSize: 10
        // }
      })

      console.log(syncState, '<---- syncState')

      syncState.error$.subscribe(error => console.log(error,'deu erro'))
      syncState.change$.subscribe(change => console.log(change, '<--- change'))
    }
  }

  // async makeSync (collections) {
  //   const defaultOptions = {
  //     waitForLeadership: true,
  //     direction: {
  //       pull: true,
  //       push: true
  //     },
  //     options: {
  //       retry: true,
  //       live: true
  //     }
  //   }

  //   const collectionsToSync = collections || Object.keys(this.collections)
  //   let collectionsActiveSync = {}
  //   let docs = {}
  //   let percentage = 0
  //   let syncedData = 0

  //   const handleOnSync = (syncState, collectionName, moduleByName) => {
  //     const runOnSync = (percentage, syncedData, collectionsActiveSync) => {
  //       this.sync.onSync && this.sync.onSync(percentage, syncedData, collectionsActiveSync)
  //       moduleByName.sync && moduleByName.sync.onSync && moduleByName.sync.onSync(percentage, syncedData, collectionsActiveSync)
  //     }

  //     syncState.change$.subscribe(change => {
  //       docs[collectionName] = change.change ? change.change.docs_read : change.docs_read
  //       syncedData = Object.values(docs).reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  //       runOnSync(percentage, syncedData)
  //     })

  //     syncState.active$.subscribe(active => {
  //       if (!Object.keys(collectionsActiveSync).length && !active) return

  //       Object.assign(collectionsActiveSync, { [collectionName]: active })

  //       const collectionsList = Object.values(collectionsActiveSync)
  //       const quantityOfFinishedSync = collectionsList.filter(value => !value).length
  //       percentage = quantityOfFinishedSync ? Math.round((100 * quantityOfFinishedSync) / collectionsList.length) : 0

  //       runOnSync(percentage, syncedData, collectionsActiveSync)
  //     })
  //   }

  //   for (const collectionIndex in collectionsToSync) {
  //     const collectionName = collectionsToSync[collectionIndex]

  //     const moduleByName = this.modules.find(module => module.name === collectionName)
  //     const moduleOptions = (moduleByName.sync && moduleByName.sync.options) || {}
  //     const syncOptions = { ...defaultOptions, ...this.sync.options, ...moduleOptions }
  //     const query = (moduleByName.sync && moduleByName.sync.query) || this.sync.query || (() => {})

  //     if (!syncOptions.baseURL) {
  //       throw new Error('baseURL is required to sync.')
  //     }

  //     const syncState = await this.collections[collectionName].syncCouchDB({
  //       ...syncOptions,
  //       remote: `${syncOptions.baseURL}/${collectionName}`,
  //       query: query(this.collections[collectionName])
  //     })

  //     if (moduleByName.sync && moduleByName.sync.handler) {
  //       moduleByName.sync.handler(syncState)
  //     }

  //     if (this.sync.onSync || (moduleByName.sync && moduleByName.sync.onSync)) {
  //       handleOnSync(syncState, collectionName, moduleByName)
  //     }
  //   }
  // }

  _getStorageAdapterPlugin () {
    const storages = {
      idb: () => require('pouchdb-adapter-idb'),
      memory: () => require('pouchdb-adapter-memory'),
    }

    return storages[this.storage]()
  }
}

export {
  PouchDB,
  createDateTime,
  createUUID,
  database,
  find,
  findByIds,
  findOne,
  nestField
}
