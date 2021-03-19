import { formatISO } from 'date-fns'

import DatabaseSetup from './databaseSetup'
import CollectionHandler from './utils/collectionHandler'
import FiltersHandler from './utils/filtersHandler'
import FormatError from './utils/formatError'
import RelationsHandler from './utils/relationsHandler'
import Uuid from './utils/uuid'
import ValidateCustomError from './utils/validateCustomError'

export default class VuexOffline {
  constructor (databaseSetup, options = {}) {
    if (!(databaseSetup instanceof DatabaseSetup)) {
      throw new Error('Please, provide an instance of DatabaseSetup')
    }

    this.databaseSetup = databaseSetup
    this.idAttribute = options.idAttribute
  }

  async createStoreModule (collectionName, options = {}) {
    if (!collectionName) {
      throw new Error('CollectionName name must be sended.')
    }

    const idAttribute = options.idAttribute || this.idAttribute || 'uuid'
    const perPage = options.perPage || 12
    const collection = this.databaseSetup.collections[collectionName]

    const collectionHandler = new CollectionHandler(collection)
    const { filters: filtersList, search: searchList } = collectionHandler.getFiltersAndSearch()
    const fieldsList = collectionHandler.getFiltersFields()
    const fieldsWithRelation = collectionHandler.getFieldsWithRelation()
    const allFields = collectionHandler.getAllFields()

    const relationsHandler = new RelationsHandler(collection, this.databaseSetup.collections)
    const fieldsWithRelationOptions = await relationsHandler.getFieldsWithRelationOptions()

    const save = async ({ commit }, { payload, id, model } = {}) => {
      try {
        const document = collection.findOne(id || payload.uuid)

        if (!document || (!id && !payload.uuid)) {
          throw new FormatError({
            status: { code: '404', text: 'Not found' }
          })
        }

        if (allFields.updatedAt) {
          payload.updatedAt = formatISO(new Date())
        }

        const parsedDocument = await document.update({ $set: { ...payload } })

        commit('setErrors', { model })
        commit('replaceItem', parsedDocument.toJSON())

        return {
          data: {
            result: parsedDocument,
            status: { code: 200 }
          }
        }
      } catch (error) {
        commit('setErrors', { model, hasError: true })
        throw new ValidateCustomError(error, collection)
      }
    }

    const module = {
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
          const { results, increment, count } = payload
          state.list = results || []

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
            const uuid = new Uuid()
            const documentToBeInserted = { uuid: uuid.create(), ...payload }

            if (allFields.createdAt) {
              documentToBeInserted.createdAt = formatISO(new Date())
            }

            const document = await collection.insert(documentToBeInserted)
            const parsedDocument = document.toJSON()

            commit('setErrors', { model: 'onCreate' })
            commit('setItemList', parsedDocument)

            return {
              data: {
                metadata: { ...parsedDocument },
                status: { code: 200 }
              }
            }
          } catch (error) {
            console.log(error)
            commit('setErrors', { model: 'onCreate', hasError: true })
            throw new ValidateCustomError(error, collection)
          }
        },

        replace: async ({ commit }, { payload, id } = {}) => {
          return save({ commit }, { payload, id, model: 'onReplace' })
        },

        update: async ({ commit }, { payload, id } = {}) => {
          return save({ commit }, { payload, id, model: 'onUpdate' })
        },

        fetchSingle: async ({ commit }, { form, id, params, url } = {}) => {
          if (!id && form) {
            return {
              data: {
                status: { code: 200 },
                fields: fieldsWithRelationOptions
              }
            }
          }

          try {
            const document = await collection.findOne(id).exec()

            if (!document) {
              throw new FormatError({
                status: { code: '404', text: 'Not found' }
              })
            }

            const parsedDocument = document.toJSON()
            const fields = form
              ? fieldsWithRelationOptions
              : await relationsHandler.getFieldsWithRelationOptionsById(result)

            commit('replaceItem', parsedDocument)
            commit('setErrors', { model: 'onFetchSingle' })

            return {
              data: {
                fields,
                result: parsedDocument,
                status: { code: 200 }
              }
            }
          } catch (error) {
            commit('setErrors', { model: 'onFetchSingle', hasError: true })
            throw error
          }
        },

        fetchFilters: async ({ commit }) => {
          const filtersHandler = new FiltersHandler({ filtersList, fieldsList })
          const filterFields = filtersHandler.getFilterFields()
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
              searchList,
              fieldsList
            })

            const skip = (page - 1) * (limit || perPage)
            const query = filtersHandler.transformQuery()
            const count = await collectionHandler.getCount(query)
            const documents = await collection.find(query).limit(limit || perPage).skip(skip).exec()
            const parsedDocuments = documents.map(document => document.toJSON())

            commit('setList', { results: parsedDocuments, increment, count })
            commit('setErrors', { model: 'onFetchList' })

            return {
              data: {
                results: parsedDocuments,
                fields: fieldsWithRelationOptions,
                status: { code: 200 }
              }
            }
          } catch (error) {
            commit('setErrors', { model: 'onFetchList', hasError: true })
            throw error
          }
        },

        destroy: async ({ commit }, { id } = {}) => {
          try {
            const document = await collection.findOne(id).exec()

            if (!document) {
              throw new FormatError({
                status: { code: 404, text: 'Not found' }
              })
            }

            document.remove()

            commit('removeItem', id)
            commit('setErrors', { model: 'onDestroy' })

            return { status: { code: 200 } }
          } catch (error) {
            commit('setErrors', { model: 'onDestroy', hasError: true })
            throw error
          }
        }
      }
    }

    Object.assign(module.actions, options.actions)
    Object.assign(module.mutations, options.mutations)

    return module
  }
}
