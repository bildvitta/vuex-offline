import { isObject } from './helpers'

export default class Model {
  constructor (model) {
    if (Model.instance instanceof Model) {
      return Model.instance.normalizedModel
    }

    Model.instance = this
    this.model = model
    this.normalizedModel = null

    return this.initialize()
  }

  initialize () {
    if (isObject(this.model)) {
      this.normalizedModel = this.model
    } else {
      try {
        this.normalizedModel = JSON.parse(this.model)
      } catch (error) {
        throw new Error('Please provide a valid model.', error)
      }
    }

    const requiredKeys = ['schema', 'fields']

    for (const key of requiredKeys) {
      if (!this.normalizedModel[key]) {
        throw new Error(`Please provide the key: ${key} inside your model.`)
      }
    }

    return this.normalizedModel
  }
}
