import {
  formatError,
  formatResponse,
  getFieldsByType,
  nestField,
  setDefaults
} from '../../utils/index.js'

export default function ({ defaults, fields }, collection) {
  return async function ({ commit }, { payload }) {
    payload = { ...setDefaults(defaults), ...payload }

    try {
      getFieldsByType(fields, 'nested', ({ name }) => {
        payload[name] = nestField(payload[name])
      })

      const document = await collection.insert(payload)
      const documentJSON = document.toJSON()

      commit('setListItem', documentJSON)
      return formatResponse({ result: documentJSON })
    } catch (error) {
      throw formatError(error)
    }
  }
}
