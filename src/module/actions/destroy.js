import {
  formatResponse,
  statusResponse
} from '../../utils/index.js'

export default function (module, collection) {
  return async function ({ commit }, { id }) {
    try {
      const document = await collection.findOne(id).exec()      

      if (!document) {
        throw statusResponse(404, 'Not found')
      }

      const documentJSON = document.toJSON()
      await document.remove()

      commit('removeListItem', id)
      return formatResponse({ result: documentJSON })
    } catch (error) {
      throw error
    }
  }
}
