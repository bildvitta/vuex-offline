import DatabaseSetup from './databaseSetup'
import PouchDBService from './pouchDBService'
import Models from './models'
import FormatError from './formatError'
import FormatResponse from './formatResponse'
import Relations from './relations'
import CollectionHandler from './collectionHandler'
import FiltersHandler from './filtersHandler'

import {
  comb
} from './helpers'

import {
  merge,
  isEmpty
} from 'lodash'

export default class {
  constructor (options = { databaseOptions: {} }) {
    this.idAttribute = options.idAttribute
    this.databaseOptions = options.databaseOptions
    this.databaseName = this.databaseOptions.alias || this.databaseOptions.name

    this.databaseSetup = new DatabaseSetup()
  }

  async createStoreModule (resource, options = { collectionOptions: {} }) {
    if (!resource) {
      throw new Error('Resource name must be sended.')
    }

    await this.databaseSetup.createDatabase(this.databaseOptions)

    const database = this.databaseSetup.getDatabase(this.databaseName)
    const idAttribute = options.idAttribute || this.idAttribute || 'id'
    const collectionHandler = new CollectionHandler({
      name: resource,
      collectionOptions: options.collectionOptions,
      database
    })

    await collectionHandler.addCollection()
    const collection = collectionHandler.getCollection()

    const save = async ({ commit }, { payload, id, model } = {}) => {
      try {
        const response = await this.pouchDBService.findOne(resource, id || payload.id)

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

        commit('setErrors', { model })
        commit('replaceItem', mergedResponse)
        return Promise.resolve(mergedResponse)
      } catch (error) {
        commit('setErrors', { model, hasError: true })
        return Promise.reject(error)
      }
    }

    return {
      namespaced: true,

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

        setList (state, payload) {
          const { results, increment } = payload
          state.list = results || []

          increment ? state.list.push(...results) : state.list = results || []

          // state.totalPages = Math.ceil(count / perPage)
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
        },

        removeItem (state, id) {
          const index = state.list.findIndex(item => item[idAttribute] === id)

          ~index && state.list.splice(index, 1)
        }
      },

      // actions
      actions: {
        create: async ({ commit }, { payload }) => {
          try {
            const document = await collection.insert({ uuid: comb(), ...payload })

            commit('setErrors', { model: 'onCreate' })
            commit('setItemList', document.toJSON())

            return document.toJSON()
          } catch (error) {
            commit('setErrors', { model: 'onCreate', hasError: true })
            return Promise.reject(error)
          }
        },

        replace: async ({ commit }, { payload, id } = {}) => {
          return save({ commit }, { payload, id, model: 'onReplace' })
        },

        update: async ({ commit }, { payload, id } = {}) => {
          return save({ commit }, { payload, id, model: 'onUpdate' })
        },

        fetchSingle: async ({ commit }, { form, id, params, url } = {}) => {
          try {
            const result = await this.pouchDBService.findOne(resource, id)

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

            // return Promise.resolve(formatResponse.success({ result }))
          } catch (error) {
            commit('setErrors', { model: 'onFetchSingle', hasError: true })
            return Promise.reject(error)
          }
        },

        fetchFilters: ({ commit }, { params } = {}) => {
          // const filtersList = this.models.getFiltersByName(resource)
          // const filters = {}

          // for (const filter of filtersList) {
          //   if (!fields[filter]) {
          //     throw new Error(`Filter "${filter}" doesn't exists.`)
          //   }

          //   filters[filter] = fields[filter]
          // }

          // commit('setFilters', filters)

          // return Promise.resolve(formatResponse.success({ fields: filters }))
        },

        fetchList: async (
          { commit },
          { filters = {}, increment, ordering = [], page = 1, limit, search } = {}
        ) => {
          try {
            const filtersHandler = new FiltersHandler(filters, collection.getFilters())

            // console.log(filtersHandler.transformQuery())

            const documents = await collection.find(filtersHandler.transformQuery()).limit(12).exec()
            const formattedDocs = documents.map(document => document.toJSON())
            console.log("🚀 ~ file: vuexOffline.js ~ line 210 ~ createStoreModule ~ formattedDocs", formattedDocs)

            // commit('setList', { results: response, increment })
            // commit('setErrors', { model: 'onFetchList' })
            // const relation = await this.pouchDBService.makeRelations()
            // return formatResponse.success({ results: response })
          } catch (error) {
            commit('setErrors', { model: 'onFetchList', hasError: true })
            return error
          }
        },

        destroy: async ({ commit }, { id } = {}) => {
          try {
            await this.pouchDBService.delete(resource, id)

            commit('removeItem', id)
            commit('setErrors', { model: 'onDestroy' })
            // return formatResponse.success()
          } catch (error) {
            commit('setErrors', { model: 'onDestroy', hasError: true })
            return error
          }
        }
      }
    }
  }
}
