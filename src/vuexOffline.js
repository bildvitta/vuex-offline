import Model from './model'
import PouchDBSetup from './pouchDBSetup'
import PouchDBService from './pouchDBService'
import Models from './models'
import FormatError from './formatError'
import FormatResponse from './formatResponse'

import {
  merge,
  isEmpty
} from 'lodash'

export default class {
  constructor (options = { pouchDBOptions: {} }, vueInstance) {
    if (!Object.keys(options.pouchDBOptions.models).length) {
      throw new Error('Please provide at leats one model.')
    }

    this.idAttribute = options.idAttribute
    this.pouchDBOptions = options.pouchDBOptions
    this.databaseName = this.pouchDBOptions.alias || this.pouchDBOptions.name

    // create models
    this.models = new Models(this.pouchDBOptions.models)
    this.normalizedModels = this.models.normalizedModel
    this.schemas = this.models.getSchemas()

    // initialize PouchDB
    this.pouchDB = new PouchDBSetup()
    this.pouchDB.createDatabase(this.pouchDBOptions.name, this.pouchDBOptions.alias)

    // initialize DatabaseService
    this.pouchDBService = new PouchDBService(this.pouchDB, {
      databaseName: this.databaseName,
      schemaName: 'posts'
    })

    this.pouchDBService.createSchema(this.schemas)
  }

  createStoreModule (resource, options = {}) {
    if (!resource) {
      throw new Error('Resource name must be sended.')
    }

    const idAttribute = options.idAttribute || this.idAttribute || 'id'

    const isFn = callback => typeof callback === 'function'

    // format response
    const formatResponse = new FormatResponse(this.normalizedModels, resource)

    const fields = this.models.getFieldsByName(resource)

    const module = {
      namespaced: options.namespaced || true,

      // states
      state: {
        filters: {},
        list: [],
        totalPages: 0,
        errors: {
          onCreate: false,
          onFetchSingle: false,
          onFetchList: false,
          onReplace: false,
          onFetchFilters: false
        }
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
        setFilters (state, payload) {
          state.filters = payload
        },

        setList (state, payload = {}) {
          const { response, increment } = payload
          const { results, count } = response.data

          increment ? state.list.push(...results) : state.list = results || []

          state.totalPages = Math.ceil(count / perPage)
        },

        setItemList (state, payload = {}) {
          state.list.push(payload)
        },

        setErrors (state, { model, hasError }) {
          state[model] = !!hasError
        },

        replaceItem (state, payload) {
          const index = state.list.findIndex(item => item[idAttribute] === payload[idAttribute])

          ~index ? state.list.splice(index, 1, payload) : state.list.push(payload)
        }
      },

      // actions
      actions: {
        create: async ({ commit }, payload = {}) => {
          try {
            const response = await this.pouchDBService.save(resource, payload)
            const result = { ...response, ...payload }

            commit('setErrors', { model: 'onCreate' })
            commit('setItemList')

            return Promise.resolve(result)
          } catch (error) {
            commit('setErrors', { model: 'onCreate', hasError: true })
            return Promise.reject(error)
          }
        },

        replace: async ({ commit }, { payload, id } = {}) => {
          try {
            const response = (await this.pouchDBService.find(resource, id || payload.id))[resource][0]

            if (!response) {
              throw new FormatError({
                status: {
                  code: '404',
                  text: 'not found!'
                }
              })
            }

            const mergedResponse = merge(response, payload)
            await this.pouchDBService.save(resource, mergedResponse)

            commit('setErrors', { model: 'onReplace' })
            commit('replaceItem', mergedResponse)
            return Promise.resolve(mergedResponse)
          } catch (error) {
            commit('setErrors', { model: 'onReplace', hasError: true })
            return Promise.reject(error)
          }
        },

        fetchSingle: async ({ commit }, { form, id, params, url } = {}) => {
          try {
            const result = (await this.pouchDBService.find(resource, id))[resource][0]

            if (!result) {
              throw new FormatError({
                status: {
                  code: '404',
                  text: 'Not found!'
                }
              })
            }

            commit('replaceItem', result)
            commit('setErrors', { model: 'onFetchSingle' })

            // this.database.createIndex({index: { fields: ['data.content', '_id'] }})

            // console.log(await this.pouchDBService.find(resource))
            // const test = this.database.find({ selector: { 'data.content': 'DEU CERTOOOOO!!!2'}} ).then((data) => {
            //   return this.database.rel.parseRelDocs(resource, data.docs);
            // })

            return Promise.resolve(formatResponse.success({ result }))
          } catch (error) {
            commit('setErrors', { model: 'onFetchSingle', hasError: true })
            return Promise.reject(error)
          }
        },

        fetchFilters: ({ commit }, { params } = {}) => {
          const filtersList = this.models.getFiltersByName(resource)
          const filters = {}

          for (const filter of filtersList) {
            if (!fields[filter]) {
              throw new Error(`Filter ${filter} doesn't exists.`)
            }

            filters[filter] = fields[filter]
          }

          commit('setFilters', filters)

          return Promise.resolve(formatResponse.success({ fields: filters }))
        },

        fetchList: async (
          { commit },
          { filters = {}, increment, ordering = [], page = 1, limit, search } = {}
        ) => {
          try {
            if (!isEmpty(filters)) {
              this.pouchDBService.createIndex(['name', '_id'])
            }

            const response = isEmpty(filters)
              ? await this.pouchDBService.find(resource)
              : await this.pouchDBService.findQuery({ selector: { 'data.name': filters.name } })

              console.log(await this.pouchDBService.findOne(resource, 'CA9ADBEA-23C5-851D-8C3C-4F9D0FFD903D'))

            // console.log("🚀 ~ file: vuexOffline.js ~ line 212 ~ createStoreModule ~ response", response)

          } catch (error) {
            return Promise.reject(error)
          }
        }
      }
    }

    return module
  }
}
