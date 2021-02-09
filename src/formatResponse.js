import Models from './models'
import { omitBy, isUndefined } from 'lodash'

export default class {
  constructor (models, name) {
    this.models = new Models(models)

    const fields = this.models.getFieldsByName(name)
    this.fields = this.filterPrivatesInObject(fields)
  }

  filterPrivates (object) {
    const publicField = {}

    for (const key in object) {
      if (!key.startsWith('__')) {
        publicField[key] = object[key]
      }
    }
  
    return publicField
  }

  filterPrivatesInObject (object) {
    const fields = {}
  
    for (const key in object) {
      fields[key] = { ...this.filterPrivates(object[key]) }
    }
  
    return fields
  }

  success (context = {}) {
    return {
      status: { code: 200 },
      ...omitBy(context, isUndefined),
      fields: context.fields ? this.filterPrivatesInObject(context.fields) : this.fields
    }
  }
}
