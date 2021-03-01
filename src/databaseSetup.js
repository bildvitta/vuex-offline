import { createRxDatabase, addRxPlugin } from 'rxdb'
import { RxDBAjvValidatePlugin } from 'rxdb/plugins/ajv-validate';

/**
 * Class to abstract the PouchDB implementation.
 *
  * @param {options} DatabaseSetup options.
 */
export default class {
  constructor (options = { databaseOptions: {} }) {
    // this.databases = {}

    this.options = options
    this.databaseOptions = options.databaseOptions
    this.databaseName = this.databaseOptions.alias || this.databaseOptions.name
    this.collectionsOptions = options.collections

    this.database = null
    this.collections = null

    this.initialize()
  }

  initialize () {
    this.addPlugins([
      require('pouchdb-adapter-idb'),
      require('pouchdb-adapter-http')
    ])
  }

  /**
   * Add a plugin to rxdb.
   *
   * @param {addRxPlugin} plugin PouchDB plugin
   */
  addPlugin (plugin) {
    addRxPlugin(plugin)
  }

  /**
   * Add a list of plugins to PouchDB.
   *
   * @param {PouchDB[]} plugins List of PouchDB plugins
   */
  addPlugins (plugins) {
    return plugins.forEach(plugin => this.addPlugin(plugin))
  }

  // async createDatabase (options = {}) {
  //   return createRxDatabase(options).then(response => {
  //     this.databases[options.name] = response
  //   })
  // }

  async createDatabase () {
    try {
      this.database = await createRxDatabase(this.databaseOptions)
      console.log(this.database, '>>>> db')

      return this.database
    } catch (error) {
      throw new Error('Error on create database', error)
    }
  }

  // async createDatabase () {
  //   try {
  //     const database = await super.createDatabase(this.databaseOptions)

  //     this.database = this.getDatabase(this.databaseName)
  //     return database
  //   } catch (error) {
  //     throw new Error('Error on create database', error)
  //   }
  // }

  /**
   * Get the database
   *
   * @param {string} name name of db.
   *
   * @example
   * databaseSetup.getDatabase('myDatabase')
   */
  getDatabase (name) {
    // console.dir(this.databases)
    return this.databases[name]
  }

  /**
   * Get the databases list
   */
  getDatabaseList () {
    return this.databases
  }

  /**
   * Delete the database. Note that this has no impact on other replicated databases.
   * Check: {@link https://rxdb.info/rx-database.html#destroy}
   *
   * @param {string} name name of database to be deleted
   *
   * @example
   * databaseSetup.deleteDatabase('myDatabase')
   */
  async deleteDatabase (name) {
    const database = this.getDatabase(name)

    if (!database) {
      throw new Error('Please provide a valid database to be deleted at function: "deleteDatabase".')
    }

    try {
      await database.destroy()
    } catch (error) {
      return error
    }
  }

  async createCollections (collections) {
    try {
      // addCollections from rxdb
      await this.database.addCollections(collections || this.collectionsOptions)
      this.collections = this.database.collections
    } catch (error) {
      throw new Error('Error on create collections', error)
    }
  }
}
