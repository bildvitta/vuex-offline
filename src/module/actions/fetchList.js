import {
  formatResponse,
  getFindQuery,
  getFieldsWithRelationshipOptions,
  mapJSON
} from '../../utils/index.js'

export default function (module, collection) {
  return async function (
    { commit },
    { filters, findQuery, increment, limit, page = 1, search } = {}
  ) {
    if (!findQuery) {
      findQuery = getFindQuery(module.filters, { filters, search })
    }

    try {
      const query = collection.find(findQuery).sort(module.sort)
      const documents = await query.exec()

      const count = documents.length
      const skip = (page - 1) * (limit || module.perPage)

      const slicedDocuments = documents.slice(skip, skip + module.perPage)
      const documentsJSON = mapJSON(slicedDocuments)

      commit('setList', { count, increment, results: documentsJSON })

      return formatResponse({
        fields: await getFieldsWithRelationshipOptions(module),
        results: documentsJSON
      })
    } catch (error) {
      return error
    }
  }
}
