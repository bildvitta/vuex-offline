import { addRxPlugin, createRxDatabase, PouchDB } from 'rxdb/plugins/core'
import { RxDBValidatePlugin } from 'rxdb/plugins/validate'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBReplicationPlugin } from 'rxdb/plugins/replication'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { actions, getters, mutations, state } from './module/index.js'

import { find, findOne, nestField } from './utils/index.js'
import { createDateTime, createUUID } from './defaults/index.js'

let database = null

export default class {
  constructor (options = {}) {
    if (!options.database.name) {
      throw new Error('Name is required.')
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

  async createDatabase () {
    // Custom Build
    // https://rxdb.info/custom-build.html
    this.addDatabasePlugin(
      RxDBValidatePlugin,
      RxDBQueryBuilderPlugin,
      RxDBMigrationPlugin,
      RxDBReplicationPlugin,
      RxDBLeaderElectionPlugin,
      RxDBUpdatePlugin,

      require('pouchdb-adapter-http'),
      require('pouchdb-adapter-idb')
    )

    if (process.env.DEBUGGING) {
      this.addDatabasePlugin(
        require('rxdb/plugins/dev-mode').RxDBDevModePlugin
      )
    }

    this.database = await createRxDatabase({
      adapter: 'idb',
      ...this.databaseOptions
    })

    database = this.database
  }

  destroyDatabase () {
    return this.database.destroy()
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
    const params = [module, collection]

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
    const listDocumentsRead = []
    const listTotalPending = []

    const calculateSyncProgress = (syncState, listDocumentsRead, listTotalPending, collectionIndex, moduleByName) => {
      syncState.change$.subscribe(({ change }) => {
        if (this.sync.progress) {
          if (!listTotalPending[collectionIndex]) {
            listTotalPending[collectionIndex] = change.pending + change.docs_read
          }
    
          listDocumentsRead[collectionIndex] = change.docs_read
          
          const total = sumList(listTotalPending)
          const progress = sumList(listDocumentsRead)
    
          if (!change.pending) {
            listTotalPending[collectionIndex] = 0
            listDocumentsRead[collectionIndex] = 0
          }
  
          this.sync.progress(Math.round((100 * progress) / total))
        }
  
        if (moduleByName.sync && moduleByName.sync.progress) {
          let totalPending = 0
  
          if (!totalPending) {
            totalPending = change.pending + change.docs_read
          }
  
          moduleByName.sync.progress(Math.round((100 * change.docs_read) / totalPending))
        }
      })
    }

    const sumList = (list) => {
      return list.length ? list.reduce((accumulator, currentValue) => accumulator + currentValue) : list
    }

    for (const collectionIndex in collectionsToSync) {
      const collectionName = collectionsToSync[collectionIndex]

      const moduleByName = this.modules.find(module => module.name === collectionName)
      const moduleOptions = (moduleByName.sync && moduleByName.sync.options) || {}
      const syncOptions = { ...defaultOptions, ...this.sync.options, ...moduleOptions }

      if (!syncOptions.baseURL) {
        throw new Error('baseURL is required to sync.')
      }

      const syncState = await this.collections[collectionName].sync({
        ...syncOptions,
        remote: `${syncOptions.baseURL}/couchdb/${collectionName}`
      })

      if (moduleByName.sync && moduleByName.sync.handler) {
        moduleByName.sync.handler(syncState)
      }

      if (this.sync.progress || (moduleByName.sync && moduleByName.sync.progress)) {
        calculateSyncProgress(syncState, listDocumentsRead, listTotalPending, collectionIndex, moduleByName)
      }
    }
  }
}

export {
  createDateTime,
  createUUID,
  database,
  find,
  findOne,
  nestField,
  PouchDB
}
