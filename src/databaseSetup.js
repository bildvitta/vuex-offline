import { createRxDatabase, addRxPlugin } from 'rxdb'

/**
 * Class to abstract the PouchDB implementation.
 *
  * @param {options} DatabaseSetup options.
 */
export default class {
  constructor (options = { databaseOptions: {} }) {
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

  async createDatabase () {
    try {
      this.database = await createRxDatabase(this.databaseOptions)

      return this.database
    } catch (error) {
      throw new Error('Error creating database.', error)
    }
  }

  /**
   * Get the database
   *
   * @param {string} name name of db.
   *
   * @example
   * databaseSetup.getDatabase('myDatabase')
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
      throw new Error('Please provide a valid database to be deleted.')
    }

    try {
      await database.destroy()
    } catch (error) {
      throw new Error('Error deleting database.', error)
    }
  }

  async createCollections (collections) {
    const usersPosts = {
      type: "object",
      version: 0,
      properties: {
        uuid: {
          type: "string",
          primary: true
        },
        status: {
          type: 'boolean'
        },
        users: {
          ref: 'users',
          type: 'string'
        },
        posts: {
          ref: 'posts',
          type: 'string'
        }
      }
    }

    const users = {
      type: "object",
      version: 0,
      properties: {
        uuid: {
          type: "string",
          primary: true
        },
        title: {
          type: "string"
        },
        posts: {
          type: 'array',
          ref: 'users_posts',
          items: {
            type: 'string'
          }
        }
      }
    }

    const posts = {
      type: "object",
      version: 0,
      properties: {
        uuid: {
          type: "string",
          primary: true
        },
        title: {
          type: "string"
        },
        users: {
          type: 'array',
          manyToMany: "users",
          ref: 'users_posts',
          items: {
            type: 'string'
          }
        }
      }
    }

    try {
      // addCollections from rxdb
      // const collection = await this.database.addCollections(collections || this.collectionsOptions)
      const collection = await this.database.addCollections({
        ...this.collectionsOptions,
        users: {
          schema: users 
        },
        posts: {
          schema: posts
        },
        users_posts: {
          schema: usersPosts
        }
      })
      this.collections = this.database.collections

      return collection
    } catch (error) {
      console.log(error)
      throw new Error('Error creating collections.', error)
    }
  }
}
