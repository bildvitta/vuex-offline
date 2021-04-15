import CollectionHandler from './collectionHandler'
import Uuid from './uuid'
import DatabaseSetup from '../databaseSetup'

import { formatISO } from 'date-fns'
import faker from 'faker'

export default class {
  constructor (databaseSetup, { collectionsList = [], seedQuantity = 25 } = {}) {
    if (!(databaseSetup instanceof DatabaseSetup)) {
      throw new Error('Please, provide an instance of DatabaseSetup')
    }

    this.databaseSetup = databaseSetup
    this.collectionsList = collectionsList
    this.seedQuantity = seedQuantity
    this.uuid = new Uuid()

    this.seederTypes = {
      boolean: '{{random.boolean}}',
      checkbox: '{{lorem.word}}',
      color: '{{internet.color}}',
      date: '{{date.recent}}',
      datetime: '{{date.recent}}',
      decimal: '{{random.float}}',
      editor: '{{lorem.paragraphs}}',
      email: '{{internet.email}}',
      money: '{{commerce.price}}',
      number: '{{random.number}}',
      password: '{{internet.password}}',
      percent: '{{random.float}}',
      radio: '{{lorem.word}}',
      select: '{{lorem.sentence}}',
      text: '{{lorem.sentence}}',
      string: '{{lorem.sentence}}',
      textarea: '{{lorem.sentences}}',
      time: '{{time.recent}}',
      upload: '{{image.image}}'
    }

    this.defaultSchemaTypes = {
      string: '',
      array: []
    }
  }

  initialize () {
    this.handleCollections()
  }

  handleCollections () {
    for (const collectionName of this.collectionsList) {
      const collection = this.databaseSetup.collections[collectionName]
      const collectionHandler = new CollectionHandler(collection)
      const fields = collectionHandler.getAllFields()

      this.generateDocuments(fields, collection)
    }
  }

  _handleDefaults (key) {
    const self = this
    const dateNow = formatISO(new Date())

    const models = {
      uuid () {
        return self.uuid.create()
      },

      creaedAt () {
        return dateNow
      },

      updatedAt () {
        return dateNow
      }
    }

    return models[key]()
  }

  generateDocuments (fields = {}, collection) {
    const documents = []
    const normalizedField = {}

    for (const key in fields) {
      const field = fields[key]
      const { props, type, ref } = field

      if (key.startsWith('_')) continue

      if (ref || (props && props.manyToMany)) {
        normalizedField[key] = this.defaultSchemaTypes[type || props && props.field && props.type]
        continue
      }

      const defaults = this._handleDefaults(key)

      if (defaults) {
        normalizedField[key] = defaults
        continue
      }

      normalizedField[key] = (
        props && props.field && props.seedValue ||
        props && props.field && props.type ||
        type
      )

      if (!this.seederTypes[normalizedField[key]]) continue

      normalizedField[key] = faker.fake(this.seederTypes[normalizedField[key]])
    }

    for (const item of this.seedQuantity) {

    }
    // this.populate(documents, collection)
  }

  async populate (documents, collection) {
    const results = await collection.bulkInsert(documents)
  }
}
