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

          getFiltersAndSearch () {
            return self._getFiltersAndSearch(this)
          },

          getOnlyFields () {
            return self._getOnlyFields(this)
          },

          getFieldsWithRelation () {
            return self._getFieldsWithRelation(this)
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
      if (fields[key].props) {
        customFields[key] = fields[key].props
      }
    }

    return customFields
  }

  _getAllFields ({ schema }) {
    return schema.jsonSchema.properties
  }

  _getOnlyFields (collectionObject) {
    const customFields = this._getCustomFields(collectionObject)
    const fields = {}

    for (const key in customFields) {
      fields[key] = customFields[key].field
    }

    return fields
  }

  _getFiltersAndSearch (collectionObject) {
    const customFields = this._getCustomFields(collectionObject)
    const object = {
      filters: [],
      search: []
    }

    for (const key in customFields) {
      customFields[key].filter && object.filters.push(key)
      customFields[key].search && object.search.push(key)
    }

    return object
  }

  _getFieldsWithRelation (collectionObject) {
    const fields = {}
    const allFields = this._getAllFields(collectionObject)

    for (const key in allFields) {
      if (allFields[key].ref) {
        fields[key] = allFields[key]
      }
    }

    return fields
  }
}
