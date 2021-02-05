import PouchDBSetup from './pouchDBSetup'

export default class {
  constructor (pouchDB, databaseName) {
    if (!(pouchDB instanceof PouchDBSetup)) {
      throw new Error('Please proviade an instance of PouchDBSetup.')
    }

    this.databaseName = databaseName
    this.pouchDB = pouchDB
  }

  createSchema (schema, databaseName) {
    return this.getDatabase(databaseName).setSchema(schema)
  }

  getDatabase (databaseName) {
    console.log(this.pouchDB.getDatabase(''), '>>>>>>')
    return this.pouchDB.getDatabase(databaseName || this.databaseName)
  }
}
