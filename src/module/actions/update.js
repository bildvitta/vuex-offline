import {
  formatError,
  formatResponse,
  getFieldsByType,
  nestField,
  setDefaults,
  statusResponse
} from '../../utils/index.js'

export default function (module, collection, { postSaveByAction }) {
  const { fields, updateDefaults, name } = module

  return async function ({ commit }, { payload, id }) {
    payload = { ...payload, ...setDefaults(updateDefaults) }

    try {
      const document = await collection.findOne(id).exec()

      if (!document) {
        throw statusResponse(404, 'Not found')
      }

      getFieldsByType(fields, 'nested', ({ name }) => {
        payload[name] = nestField(payload[name])
      })

      await document.update({ $set: payload })
      const result = { ...document.toJSON(), ...payload }

      commit('replaceItem', result)

      postSaveByAction({
        name,
        fields,
        payload: result,
      })
      return formatResponse({ result })
    } catch (error) {
      throw formatError(error)
    }
  }
}
