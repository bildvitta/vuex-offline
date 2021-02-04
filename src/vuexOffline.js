import Model from './model'

export default class {
  constructor (options = {}) {
    this.idAttribute = options.idAttribute
  }

  createStoreModule (resource, model, options = {}) {
    if (!(resource || model)) {
      throw new Error('Resource name or model must be sended.')
    }

    const formattedModel = new Model(model)

    const idAttribute = options.idAttribute || this.idAttribute || '_id'

    return {
      namespaced: options.namespaced || true,

      // states
      state: {
        filters: {},
        list: [],
        totalPages: 0
      },

      // getters
      getters: {
        list: state => state.list,

        filters: state => state.filters,

        totalPages: state => state.totalPages,

        byId: state => id => state.list.find(item => item[idAttribute] === id)
      },

      // mutations
      mutations: {
        setFilters (state, payload) {},

        setList (state, payload = {}) {
          const { response, increment } = payload
          const { results, count } = response.data

          increment ? state.list.push(...results) : state.list = results || []

          state.totalPages = Math.ceil(count / perPage)
        }
      },

      // actions
      actions: {
        fetchFilters ({ commit }, { params } = {}) {
          commit('setFilters')
        },

        fetchList (
          { commit }
          { filters = {}, increment, ordering = [], page = 1, limit, search } = {}
        ) {

        }
      }
    }
  }
}
