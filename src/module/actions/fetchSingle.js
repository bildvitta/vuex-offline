import {
  formatResponse,
  getFieldsWithRelationshipOptions,
  statusResponse
} from '../../utils/index.js'

export default function (module, collection) {
  return async function ({ commit }, { form, id }) {
    const fields = await getFieldsWithRelationshipOptions(module)

    if (form && !id) {
      return formatResponse({ fields })
    }

    try {
      const document = await collection.findOne(id).exec()

      if (!document) {
        throw statusResponse(404, 'Not found')
      }

      const documentJSON = document.toJSON()
      commit('replaceItem', documentJSON)

      return formatResponse({ fields, result: documentJSON })
    } catch (error) {
      return error
    }
  }
}
