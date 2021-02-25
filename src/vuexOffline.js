import DatabaseSetup from './databaseSetup'
import PouchDBService from './pouchDBService'
import Models from './models'
import FormatError from './formatError'
import FormatResponse from './formatResponse'
import Relations from './relations'
import FiltersHandler from './filtersHandler'

import CollectionHandler from './utils/collectionHandler'
import RelationsHandler from './utils/relationsHandler'

import FetchFiltersService from './services/fetchFiltersService'
import FetchListService from './services/fetchListService'


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
    this.collectionsOptions = options.collections
    this.databaseName = this.databaseOptions.alias || this.databaseOptions.name
  }

  async initialize () {
    this.databaseSetup = new DatabaseSetup()

    await this.databaseSetup.createDatabase(this.databaseOptions)
    this.database = this.databaseSetup.getDatabase(this.databaseName)

    await this.database.addCollections(this.collectionsOptions)
    this.collections = this.database.collections
  }

  async createStoreModule (resource, options = { collectionOptions: {} }) {
    if (!resource) {
      throw new Error('Resource name must be sended.')
    }

    const idAttribute = options.idAttribute || this.idAttribute || 'id'
    const collection = this.collections[resource]
    const collectionHandler = new CollectionHandler(collection, this.database)

    const { filters: filtersList, search: searchList } = collectionHandler.getFiltersAndSearch()
    const fieldsList = collectionHandler.getOnlyFields()
    const fieldsWithRelation = collectionHandler.getFieldsWithRelation()

    const relationsHandler = new RelationsHandler(collection, this.collections)
    const fieldsWithRelationOptions = await relationsHandler.getFieldsWithRelationOptions()

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
            console.log(payload)
            const document = await collection.insert({ uuid: comb(), ...payload })

            commit('setErrors', { model: 'onCreate' })
            commit('setItemList', document.toJSON())

            return document.toJSON()
          } catch (error) {
            console.log(error, '>>> error')
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
            const result = id ? await collection.findOne(id).exec() : null
            
            if (!id && form) {
              console.log("🚀 ~ cai sim")
              return {
                data: {
                  status: { code: 200 },

                  fields: fieldsWithRelationOptions
                }
              }
            }

            // if (!result) {
            //   throw new FormatError({
            //     status: {
            //       code: '404',
            //       text: 'Not found!'
            //     }
            //   })
            // }

            commit('replaceItem', result)
            commit('setErrors', { model: 'onFetchSingle' })

            return Promise.resolve(formatResponse.success({ result }))
          } catch (error) {
            commit('setErrors', { model: 'onFetchSingle', hasError: true })
            return Promise.reject(error)
          }
        },

        fetchFilters: async ({ commit }) => {
          const fetchFiltersService = new FetchFiltersService(filtersList, fieldsList)
          const filterFields = fetchFiltersService.getFilterFields()
          const formattedFilterFields = await relationsHandler.getFieldsWithRelationOptions(filterFields)

          commit('setFilters', formattedFilterFields)

          return {
            fields: formattedFilterFields,
            status: { code: 200 }
          }
        },

        fetchList: async (
          { commit },
          { filters = {}, increment, ordering = [], page = 1, limit, search } = {}
        ) => {
          try {
            const filtersHandler = new FiltersHandler({
              receivedFilters: filters,
              filtersList,
              receivedSearch: search,
              searchList
            })

            const query = filtersHandler.transformQuery()
            const documents = await collection.find(query).limit(limit).exec()
            const formattedDocuments = documents.map(document => document.toJSON())


            commit('setList', { results: formattedDocuments, increment })
            commit('setErrors', { model: 'onFetchList' })

            return {
              data: {
                results: formattedDocuments,
                fields: fieldsWithRelationOptions,
                status: { code: 200 }
              }
            }
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
