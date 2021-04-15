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

    window.faker = faker

    this.databaseSetup = databaseSetup
    this.collectionsList = collectionsList
    this.seedQuantity = seedQuantity
    this.uuid = new Uuid()

    this.seederTypes = {
      boolean: '{{datatype.boolean}}',
      checkbox: '{{lorem.word}}',
      color: '{{internet.color}}',
      date: '{{date.recent}}',
      datetime: '{{date.recent}}',
      decimal: '{{random.float}}',
      editor: '{{lorem.paragraphs}}',
      email: '{{internet.email}}',
      money: '{{commerce.price}}',
      number: '{{datatype.number}}',
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
      string: 'seed-test',
      array: ['seed-test']
    }
  }

  initialize () {
    return this.handleCollections()
  }

  handleCollections () {
    for (const collectionName of this.collectionsList) {
      const collection = this.databaseSetup.collections[collectionName]
      const collectionHandler = new CollectionHandler(collection)
      const fields = collectionHandler.getAllFields()

      this.generateDocuments(fields, collection)
    }
  }

  _propsHandler (props) {
    function _getField () {
      return props && props.field
    }

    return {
      getField () {
        return _getField()
      },

      getSeedValue () {
        return props && props.seedValue
      },

      getType () {
        return _getField() && _getField().type
      }
    }
  }

  generateDocuments (fields = {}, collection) {
    const documents = []
    const normalizedField = {}

    for (const key in fields) {
      const field = fields[key]
      const { props, type, ref } = field
      const { getField, getSeedValue, getType } = this._propsHandler(props)

      if (key.startsWith('_')) continue

      if (ref || (props && props.manyToMany)) {
        normalizedField[key] = this.defaultSchemaTypes[type || getType()]
        continue
      }

      normalizedField[key] = this.normalizeValue(
        (getSeedValue() || getType() || type),
        key
      )
    }

    for (let index = 1; index <= this.seedQuantity; index++) {
      documents.push({ ...normalizedField, uuid: this.uuid.create() })
    }

    return this.populate(documents, collection)
  }

  normalizeValue (type, key, field) {
    const dateNow = formatISO(new Date())

    const models = {
      number: () => Number(faker.fake(this.seederTypes[type])),
      nested: () => [],
      boolean: () => Boolean(faker.fake(this.seederTypes[type])),
      createdAt: () => dateNow,
      updatedAt: () => dateNow
    }

    const typeModel = models[type] && models[type]()
    const keyModel = models[key] && models[key]()

    try {
      return typeModel || keyModel || faker.fake(this.seederTypes[type])
    } catch {
      return type || key
    }

    // return typeModel || keyModel || faker.fake(this.seederTypes[type])
  }

  async populate (documents, collection) {
    const results = await collection.bulkInsert(documents)

    return results
  }
}
