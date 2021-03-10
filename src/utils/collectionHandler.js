export default class {
  constructor (collection) {
    this.collection = collection
  }

  async getCount (query) {
    const list = await this.collection.find(query).exec()

    return list.length
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

  getFiltersFields () {
    const filtersFields = {}
    const customFields = this.getCustomFields()

    for (const key in customFields) {
      const filters = customFields[key].filter

      if (!filters) continue

      if (typeof filters === 'boolean') {
        filtersFields[key] = customFields[key].field
        continue
      }

      for (const filtersKey in filters) {
        filtersFields[filtersKey] = filters[filtersKey]
      }
    }

    return filtersFields
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
    // const customFields = this.getCustomFields()
    const customFields = this.getFiltersFields()
    // console.log("🚀 custommm", customFields)
    const object = {
      filters: [],
      search: []
    }

    for (const key in customFields) {
      console.log(customFields[key], '>>> oush')
      object.filters.push(key)
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
