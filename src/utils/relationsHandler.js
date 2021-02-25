import CollectionHandler from './collectionHandler'
import { cloneDeep } from 'lodash'

export default class {
  constructor (collection, collections) {
    this.collectionHandler = new CollectionHandler(collection)
    this.fieldsWithRelation = this.collectionHandler.getFieldsWithRelation()
    this.collections = collections
    this.collection = collection
  }

  async getFieldsWithRelationOptionsById (document, id) {
    const fields = cloneDeep(this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      const documents = await document.populate(key)
      const options = []
      const formattedDocuments = documents.map(document => {
        const documentToJSON = document.toJSON()

        options.push({
          value: document.uuid,
          label: document[this.fieldsWithRelation[key].props['refLabel']],
          data: documentToJSON
        })

        return documentToJSON
      })

      fields[key].options = options
    }

    return fields
  }

  async getFieldsWithRelationOptions (externalFields) {
    const fields = cloneDeep(externalFields || this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      const documents = await this.collections[key].find().exec()
      const options = []
      const formattedDocuments = documents.map(document => {
        const documentToJSON = document.toJSON()

        options.push({
          value: document.uuid,
          label: document[this.fieldsWithRelation[key].props['refLabel']],
          data: documentToJSON
        })

        return documentToJSON
      })

      fields[key].options = options
    }

    return fields
  }
}
