import { isObject } from './helpers'

export default class Models {
  constructor (models) {
    if (Models.instance instanceof Models) {
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
      schemas.push(this.normalizedModels[key].schema)
    }

    return schemas
  }

  getFieldsByName (name) {
    return this.normalizedModels[name].fields
  }

  getFiltersByName (name) {
    return this.normalizedModels[name].filters
  }

  normalizeModel (model, name) {
    const requiredKeys = ['schema', 'fields']
    let normalizedModel = model

    if (!isObject(model)) {
      try {
        normalizedModel = JSON.parse(model)
      } catch (error) {
        throw new Error(`Model "${name}" is not valid,`, error)
      }
    }

    for (const key of requiredKeys) {
      if (!normalizedModel[key]) {
        throw new Error(`Please provide the key "${key}" inside your model "${name}".`)
      }
    }

    return normalizedModel
  }
}
