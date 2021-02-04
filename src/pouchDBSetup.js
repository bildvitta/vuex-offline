import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import RelationalPouch from 'relational-pouch'

/**
 * Class to abstract the PouchDB implementation.
 *
  * @param {options} PouchDBSetup options.
  * @param options.relationalPlugin enables RelationalPouch plugin (default `true`).
  * @param options.findPlugin enables PouchDBFind plugin (default `true`).
 */
export default class {
  constructor (options = {}) {
    this.databases = {}
    this.globalOptions = {
      relationalPlugin: true,
      findPlugin: true,
      ...options
    }
  }

  initialize () {
    const { relationalPlugin, findPlugin } = this.globalOptions

    if (!(relationalPlugin && findPlugin)) return null

    const plugins = []

    relationalPlugin && plugins.push(RelationalPouch)
    findPlugin && plugins.push(PouchDBFind)

    this.addPlugins(plugins)
  }

  getPouchDBInstance () {
    return PouchDB
  }

  /**
   * Add a plugin to PouchDB.
   *
   * @param {PouchDB} plugin PouchDB plugin
   */
  addPlugin (plugin) {
    PouchDB.plugin(plugin)
  }

  /**
   * Add a list of plugins to PouchDB.
   *
   * @param {PouchDB[]} plugins List of PouchDB plugins
   */
  addPlugins (plugins) {
    return plugins.forEach(plugin => this.addPlugin(plugin))
  }

  /**
   * This method creates a database and add to the list of databases.
   * Check: {@link https://pouchdb.com/api.html#create_database}
   *
   * @param {string} name argument of PouchDB can be the name of db too
   * @param {string=} alias if you are sending a remote db and wants to give a name to this instance you can send an alias. (alias overrides the param `name`.)
   * @param {object} options PouchDB create Options.
   *
   * @example
   * myInstanceOfPouchDBSetup.createDatabase('https://my-remote-db.com', 'myRemoteDB') // the second arg is the alias for this db.
   * myInstanceOfPouchDBSetup.createDatabase('myDatabase') // if not send an alias name of db will be `myDatabase`
   */
  createDatabase (name, alias, options = {}) {
    alias = alias || name

    this.databases[alias] = new PouchDB(name, options)
  }

  /**
   * Get the database
   *
   * @param {string} name name of db.
   *
   * @example
   * myInstanceOfPouchDBSetup.getDatabase('myDatabase')
   */
  getDatabase (name) {
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
   * Check: {@link https://pouchdb.com/api.html#delete_database}
   *
   * @param {string} name name of database to be deleted
   * @param {object} options options of database to be deleted
   * @param {function} callback from db.destroy()
   *
   * @example
   * myInstanceOfPouchDBSetup.deleteDatabase('myDatabase')
   */
  deleteDatabase (name, options = {}, callback = function () {}) {
    console.log(callback)
    if (!this.getDatabase(name)) {
      throw new Error('Please provide a valid database to be deleted at function: "deleteDatabase"')
    }

    return this.getDatabase(name).destroy(options, callback).then(response => {
      return delete this.databases[name] && Promise.resolve(response)
    })
  }

  /**
   * Sync data from src to target and target to src.
   * This is a convenience method for bidirectional data replication.
   * {@link https://pouchdb.com/api.html#sync}.
   * @param {string} src
   * @param {string} target
   * @param {object} options
   *
   * @returns PouchDB.sync(src, target, options)
   *
   * @example
   * myInstanceOfPouchDBSetup.sync('my_database', 'http://localhost:5984/my_database', {
      live: true,
      retry: true
    })
   */
  sync (src, target, options = {}) {
    return PouchDB.sync(src, target, options)
  }
}
