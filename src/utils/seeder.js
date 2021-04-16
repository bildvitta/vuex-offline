import CollectionHandler from './collectionHandler'
import Uuid from './uuid'
import DatabaseSetup from '../databaseSetup'
import FormatError from './formatError'

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
      boolean: '{{datatype.boolean}}',
      checkbox: '{{lorem.word}}',
      color: '{{internet.color}}',
      date: '{{date.recent}}',
      datetime: '{{datatype.datetime}}',
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
      string: '__change__this__value__',
      array: ['__change__this__value__']
    }
  }

  initialize () {
    return this.handleCollections()
  }

  async handleCollections () {
    for (const collectionName of this.collectionsList) {
      try {
        const collection = this.databaseSetup.collections[collectionName]
        const collectionHandler = new CollectionHandler(collection)
        const fields = collectionHandler.getAllFields()
        await this.generateDocuments(fields, collection)
      } catch {
        throw new FormatError({
          errors: {
            collection: collectionName
          },
          status: {
            code: 500,
            text: `Error on generate seed of collection ${collectionName}`
          }
        })
      }
    }

    return Promise.resolve(true)
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
        key,
        field
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
      select: () => {
        const value = faker.fake(this.seederTypes[type])

        return field.multiple ? value : [value]
      },
      datetime: () => dateNow,
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
  }

  async populate (documents, collection) {
    const results = await collection.bulkInsert(documents)

    return results
  }
}
