import CollectionHandler from './collectionHandler'
import { cloneDeep } from 'lodash'

export default class {
  constructor (collection, collections) {
    this.collectionHandler = new CollectionHandler(collection)
    this.fieldsWithRelation = this.collectionHandler.getFieldsWithRelation()
    this.collections = collections
  }

  setOptions (documents = [], key, relationValues = []) {
    if (!documents.length) return []

    documents = Array.isArray(documents) ? documents : [documents]
    const options = []

    documents.forEach(document => {
      const parsedDocument = document.toJSON()
      const fieldProps = this.fieldsWithRelation[key].props
      const relation = relationValues.find(item => item.uuid === document.uuid)

      options.push({
        value: fieldProps['refValue'] || document.uuid,
        label: document[fieldProps['refLabel']],
        data: parsedDocument,
        relation
      })

      return parsedDocument
    })

    return options
  }

  _propsHandler (props) {
    return {
      getManyToMany () {
        return props && props.manyToMany
      }
    }
  }

  async getFieldsWithRelationOptionsById (document) {
    const fields = cloneDeep(this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      const { getManyToMany } = this._propsHandler(this.fieldsWithRelation[key].props)

      if (getManyToMany()) {
        const results = await this.collections[key].findByIds(document[key].map(item => item.uuid))
        fields[key].options = this.setOptions(Array.from(results.values()), key, document[key])
        continue
      }

      fields[key].options = this.setOptions(await document.populate(key) || [], key)
    }

    return fields
  }

  async getFieldsWithRelationOptions (externalFields) {
    const fields = cloneDeep(externalFields || this.collectionHandler.getOnlyFields())

    for (const key in this.fieldsWithRelation) {
      const { getManyToMany } = this._propsHandler(this.fieldsWithRelation[key].props)

      fields[key].options = this.setOptions(
        await this.collections[
          this.fieldsWithRelation[key].ref || getManyToMany()
        ].find().exec(), key
      )
    }

    return fields
  }
}
