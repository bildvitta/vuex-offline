import {
  formatError,
  formatResponse,
  getFieldsByType,
  nestField,
  setDefaults,
  deleteBy
} from '../../utils/index.js'

export default function (module, collection, { postSaveByAction }) {
  const { defaults, fields, name } = module

  
  return async function ({ commit }, { payload }) {
    payload = { ...setDefaults(defaults), ...deleteBy(payload, item => item === undefined) }

    try {
      getFieldsByType(fields, 'nested', ({ name }) => {
        payload[name] = nestField(payload[name])
      })

      const document = await collection.insert(payload)
      const documentJSON = document.toJSON()

      commit('setListItem', documentJSON)

      postSaveByAction({
        name,
        fields,
        payload: documentJSON,
      })
      return formatResponse({ result: documentJSON })
    } catch (error) {
      throw formatError(error)
    }
  }
}
