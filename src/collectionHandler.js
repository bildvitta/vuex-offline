export default class {
  constructor ({ name, collectionOptions, database }) {
    this.collectionOptions = collectionOptions
    this.name = name
    this.database = database
  }

  addCollection () {
    const self = this
    const {
      statics
    } = this.collectionOptions

    return this.database.addCollections({
      [this.name]: {
        ...this.collectionOptions,

        statics: {
          ...statics,

          getAllFields () {
            return self._getAllFields(this)
          },

          getCount () {
            return self.getCount()
          },

          getCustomFields () {
            return self._getCustomFields(this)
          },

          getFilters () {
            return self._getFilters(this)
          }
        }
      }
    })
  }

  async getCount () {
    const count = (await this.getCollection().find().exec()).length

    return count
  }

  getCollection (name) {
    return this.database.collections[name || this.name]
  }

  _getCustomFields (collectionObject) {
    const customFields = {}
    const fields = this._getAllFields(collectionObject)

    for (const key in fields) {
      if (fields[key].custom) {
        customFields[key] = fields[key].custom
      }
    }

    return customFields
  }

  _getAllFields ({ schema }) {
    return schema.jsonSchema.properties
  }

  _getFilters(collectionObject) {
    const customFields = this._getCustomFields(collectionObject)
    const filters = []

    for (const key in customFields) {
      if (customFields[key].filter) {
        filters.push(key)
      }
    }

    return filters
  }
}
