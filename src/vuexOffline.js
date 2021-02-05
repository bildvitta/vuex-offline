import Model from './model'
import PouchDBSetup from './pouchDBSetup'
import PouchDBService from './pouchDBService'

export default class {
  constructor (options = { pouchDBOptions: {} }) {
    this.idAttribute = options.idAttribute
    this.pouchDBOptions = options.pouchDBOptions
    this.databaseName = this.pouchDBOptions.alias || this.pouchDBOptions.name

    // initialize PouchDB
    this.pouchDB = new PouchDBSetup()
    this.pouchDB.initialize()
    this.pouchDB.createDatabase(this.pouchDBOptions.name, this.pouchDBOptions.alias)
  }

  createStoreModule (resource, model, options = {}) {
    if (!(resource || model)) {
      throw new Error('Resource name or model must be sended.')
    }


    const formattedModel = new Model(model)
    const pouchDBService = new PouchDBService(this.pouchDB, this.databaseName)

    const { filters, fields, schema } = formattedModel
    const idAttribute = options.idAttribute || this.idAttribute || '_id'

    pouchDBService.createSchema([schema])

    // console.log(pouchDBService, '>>>>>>>>>>')

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
          { commit },
          { filters = {}, increment, ordering = [], page = 1, limit, search } = {}
        ) {
          return false
        }
      }
    }
  }
}
