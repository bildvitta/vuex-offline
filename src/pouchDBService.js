import PouchDBSetup from './pouchDBSetup'
import { uniq } from 'lodash'

export default class {
  constructor (pouchDB, options = {}) {
    if (!(pouchDB instanceof PouchDBSetup)) {
      throw new Error('Please provide an instance of PouchDBSetup.')
    }

    this.databaseName = options.databaseName
    this.filters = options.filters

    this.pouchDB = pouchDB
    this.database = this.pouchDB.getDatabase(this.databaseName)

    if (this.filters) {
      this.createIndex(this.filters)
    }
  }

  createSchema (schema = []) {
    return this.database.setSchema(schema)
  }

  createIndex (filters) {
    const filtersToFlatArray = Object.values(filters).flat()
    const nonDuplicatedFilters = uniq(filtersToFlatArray)

    return this.database.createIndex({ index: { fields: nonDuplicatedFilters } })
  }

  save (name, payload) {
    return this.database.rel.save(name, payload)
  }

  delete (name, options) {
    return this.findOne(name, options).then(response => this.database.rel.del(name, response))
  }

  find (name, options = {}) {
    return this.database.rel.find(name, options).then(response => response[name])
    // return this.database.rel.find(name, options).then(response => response)
  }

  findOne (name, id) {
    return id ? this.database.rel.find(name, id).then(response => response[name][0]) : {}
  }

  findQuery (name, options = {}) {
    return this.database.find(options).then(data => this.database.rel.parseRelDocs(name, data.docs))
  }

  async makeRelations () {
    // 43EE4771-9B69-293C-947C-3111E0850934 author
    const item =  await this.findOne('authors', '91C9C311-DD12-267F-AD44-F8FBE0532526')
    // const item = await this.find('posts')
    item.posts = ["075020FE-72F6-9050-8848-FA011633BA56"]
    await this.save('authors', item)
    this.pouchDB.getPouchDBInstance().createIndex({index: { fields: ['data.authors', 'data.posts', '_id'] }})
    const teste = await this.database.rel.findHasMany('authors', 'posts', '075020FE-72F6-9050-8848-FA011633BA56')
    // return this.save('authors', {
    //   "name": "teste 2",
    //   "email": "teste@teste",
    //   "posts": ['D07C7242-6ADB-B92C-AB81-C699BBC3E839'],
    //   "comments": [],
    //   "id": "D07C7242-6ADB-B92C-AB81-C699BBC3E839",
    //   "rev": "1-419bfe65875914c6ac7bc7edb3dbd979"
    // })
  }
}
