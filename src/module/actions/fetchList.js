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
    try {
      const { preQueryList } = module.interceptors || {}
      const findParam = preQueryList ? preQueryList({ search, filters }) : findQuery || {}

      if (!findQuery) {
        findQuery = getFindQuery(module.filters, {
          filters: findParam.filters || filters,
          search: findParam.search || search
        })
      }

      console.log(collection, '>>>> collection')

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
      console.log(error, '<<<< error from fetchList')
      return error
    }
  }
}
