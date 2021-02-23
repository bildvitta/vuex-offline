import { isObject } from 'lodash'
// import Relations from './relations'

export default class Models {
  constructor (models) {
    if (!models && Models.instance instanceof Models) {
      return Models.instance
    }

    Models.instance = this
    this.models = models

    this.normalizedModels = this.getModels()
  }

  getModels () {
    const models = {}

    for (const key in this.models) {
      models[key] = this.normalizeModel(this.models[key], key)
    }

    return models
  }

  getModelByName (name) {
    return this.normalizedModels[name]
  }

  getSchemaByModelName (name) {
    return this.getModelByName(name).schema
  }

  getSchemas () {
    const schemas = []

    for (const key in this.normalizedModels) {
      // const relations = new Relations(this.normalizedModels[key].fields, this.normalizedModels)

      // relations.getRelationsFromFields()
      schemas.push(this.normalizedModels[key].schema)
    }

    return schemas
  }

  getRelationByModel (model) {

  }

  getFieldsByName (name) {
    return this.normalizedModels[name].fields
  }

  getFilters () {
    const filters = {}

    for (const key in this.normalizedModels) {
      if (this.normalizedModels[key].filters) {
        filters[key] = this.normalizedModels[key].filters
      }
    }

    return filters
  }

  getFiltersByName (name) {
    return this.normalizedModels[name].filters
  }

  normalizeModel (model, name) {
    // const requiredKeys = ['schema', 'fields']
    // const requiredKeys = []
    let normalizedModel = model

    // if (!isObject(model)) {
    //   try {
    //     normalizedModel = JSON.parse(model)
    //   } catch (error) {
    //     throw new Error(`Model "${name}" is not valid,`, error)
    //   }
    // }

    // for (const key of requiredKeys) {
    //   if (!normalizedModel[key]) {
    //     throw new Error(`Please provide the key "${key}" inside your model "${name}".`)
    //   }
    // }

    return normalizedModel
  }
}
