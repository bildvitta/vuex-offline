import CollectionHandler from './collectionHandler'
import { cloneDeep } from 'lodash'

export default class {
  constructor (collection, collections) {
    this.collectionHandler = new CollectionHandler(collection)
    this.fieldsWithRelation = this.collectionHandler.getFieldsWithRelation()
    this.collections = collections
  }

  setOptions (documents = [], key) {
    const options = []

    documents.forEach(document => {
      const parsedDocument = document.toJSON()

      options.push({
        value: document.uuid,
        label: document[this.fieldsWithRelation[key].props['refLabel']],
        data: parsedDocument
      })

      return parsedDocument
    })

    return options
  }

  async getFieldsWithRelationOptionsById (document) {
    const fields = cloneDeep(this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      fields[key].options = this.setOptions(
        await document.populate(this.fieldsWithRelation[key].ref), key
      )
    }

    return fields
  }

  async getFieldsWithRelationOptions (externalFields) {
    const fields = cloneDeep(externalFields || this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      fields[key].options = this.setOptions(
        await this.collections[this.fieldsWithRelation[key].ref].find().exec(), key
      )
    }

    return fields
  }
}
