import {
  formatResponse
} from '../../utils/index.js'

export default function ({ filters }) {
  return async function ({ commit }) {
    try {
      const { fields } = filters

      commit('setFilters', fields)
      return formatResponse({ fields })
    } catch (error) {
      return error
    }
  }
}
