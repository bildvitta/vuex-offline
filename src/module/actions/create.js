import {
  formatError,
  formatResponse,
  getFieldsByType,
  nestField,
  setDefaults,
  postSaveByActionResponse
} from '../../utils/index.js'

export default function (module, collection, postSaveByAction) {
  const { defaults, fields, uploads, name } = module

  return async function ({ commit }, { payload }) {
    payload = { ...setDefaults(defaults), ...payload }

    try {
      getFieldsByType(fields, 'nested', ({ name }) => {
        payload[name] = nestField(payload[name])
      })

      const document = await collection.insert(payload)
      const documentJSON = document.toJSON()

      commit('setListItem', documentJSON)

      postSaveByAction(postSaveByActionResponse({
        name,
        uploads,
        payload: documentJSON
      }))
      return formatResponse({ result: documentJSON })
    } catch (error) {
      throw formatError(error)
    }
  }
}
