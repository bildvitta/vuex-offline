import Models from './models'
import { omitBy, isUndefined } from 'lodash'

export default class {
  constructor (models, name) {

  }

  success (context = {}) {
    return {
      data: {
        status: { code: 200 },
        ...omitBy(context, isUndefined),
        fields: context.fields ? this.filterPrivatesInObject(context.fields) : this.fields
      }
    }
  }
}
