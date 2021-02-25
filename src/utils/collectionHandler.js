export default class {
  constructor (collection) {
    this.collection = collection
  }

  async getCount () {
    const count = (await this.collection.find().exec()).length

    return count
  }

  getCustomFields () {
    const customFields = {}
    const fields = this.getAllFields()

    for (const key in fields) {
      if (fields[key].props) {
        customFields[key] = fields[key].props
      }
    }

    return customFields
  }

  getAllFields () {
    return this.collection.schema.jsonSchema.properties
  }

  getOnlyFields () {
    const customFields = this.getCustomFields()
    const fields = {}

    for (const key in customFields) {
      fields[key] = customFields[key].field
    }

    return fields
  }

  getFiltersAndSearch () {
    const customFields = this.getCustomFields()
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

  getFieldsWithRelation () {
    const fields = {}
    const allFields = this.getAllFields()

    for (const key in allFields) {
      if (allFields[key].ref) {
        fields[key] = allFields[key]
      }
    }

    return fields
  }
}
