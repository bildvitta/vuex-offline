import PouchDBSetup from './pouchDBSetup'

export default class {
  constructor (pouchDB, options = {}) {
    if (!(pouchDB instanceof PouchDBSetup)) {
      throw new Error('Please provide an instance of PouchDBSetup.')
    }

    this.databaseName = options.databaseName
    this.schemaName = options.schemaName
    this.pouchDB = pouchDB
    this.database = this.pouchDB.getDatabase(this.databaseName)
  }

  createSchema (schema) {
    return this.database.setSchema(schema)
  }

  createIndex (fields) {
    this.database.createIndex({ index: { fields } })
  }

  save (name, payload) {
    return this.database.rel.save(name || this.schemaName, payload)
  }

  find (name, options = {}) {
    return this.database.rel.find(name || this.schemaName, options)
  }

  findOne (name, id) {
    return this.database.rel.find(name, id).then(response => response[name][0])
  }

  findQuery (options = {}) {
    return this.database.find(options).then(data => this.database.rel.parseRelDocs(this.schemaName, data.docs))
  }
}
