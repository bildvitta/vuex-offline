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
    const defaultOptions = {
      waitForLeadership: true,
      direction: {
        pull: true,
        push: true
      },
      options: {
        retry: true,
        live: true
      }
    }

    const collectionsToSync = collections || Object.keys(this.collections)
    let collectionsActiveSync = {}
    let docs = {}
    let percentage = 0
    let syncedData = 0

    const handleOnSync = (syncState, collectionName, moduleByName) => {
      const runOnSync = (percentage, syncedData, collectionsActiveSync) => {
        this.sync.onSync && this.sync.onSync(percentage, syncedData, collectionsActiveSync)
        moduleByName.sync && moduleByName.sync.onSync && moduleByName.sync.onSync(percentage, syncedData, collectionsActiveSync)
      }

      syncState.change$.subscribe(change => {
        docs[collectionName] = change.change ? change.change.docs_read : change.docs_read
        syncedData = Object.values(docs).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        
        runOnSync(percentage, syncedData)
      })

      syncState.active$.subscribe(active => {
        if (!Object.keys(collectionsActiveSync).length && !active) return

        Object.assign(collectionsActiveSync, { [collectionName]: active })

        const collectionsList = Object.values(collectionsActiveSync)
        const quantityOfFinishedSync = collectionsList.filter(value => !value).length
        percentage = quantityOfFinishedSync ? Math.round((100 * quantityOfFinishedSync) / collectionsList.length) : 0

        runOnSync(percentage, syncedData, collectionsActiveSync)
      })
    }

    for (const collectionIndex in collectionsToSync) {
      const collectionName = collectionsToSync[collectionIndex]

      const moduleByName = this.modules.find(module => module.name === collectionName)
      const moduleOptions = (moduleByName.sync && moduleByName.sync.options) || {}
      const syncOptions = { ...defaultOptions, ...this.sync.options, ...moduleOptions }
      const query = (moduleByName.sync && moduleByName.sync.query) || this.sync.query || (() => {})

      if (!syncOptions.baseURL) {
        throw new Error('baseURL is required to sync.')
      }

      const syncState = await this.collections[collectionName].syncCouchDB({
        ...syncOptions,
        remote: `${syncOptions.baseURL}/${collectionName}`,
        query: query(this.collections[collectionName])
      })

      if (moduleByName.sync && moduleByName.sync.handler) {
        moduleByName.sync.handler(syncState)
      }

      if (this.sync.onSync || (moduleByName.sync && moduleByName.sync.onSync)) {
        handleOnSync(syncState, collectionName, moduleByName)
      }
    }
  }

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
