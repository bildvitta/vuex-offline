import {
  formatResponse,
  getFieldsWithRelationshipOptions
} from '../../utils/index.js'

export default function ({ filters, idKey, parent }) {
  return async function ({ commit }) {
    try {
      const { fields, relationships } = filters
      const formattedFields = await getFieldsWithRelationshipOptions({ fields, idKey, parent, relationships })

      commit('setFilters', formattedFields)
      return formatResponse({ formattedFields })
    } catch (error) {
      return error
    }
  }
}
