export default function ({ idKey, mutations, perPage }) {
  return {
    setFilters (state, payload) {
      state.filters = payload
    },

    setList (state, { count, increment, results = [] }) {
      if (increment) {
        state.list.push(...results)
      } else {
        state.list = results
      }

      state.totalPages = Math.ceil(count / perPage)
    },

    setListItem (state, payload = {}) {
      state.list.push(payload)
    },

    setErrors (state, { model, hasError }) {
      state[model] = !!hasError
    },

    replaceItem (state, payload) {
      const index = state.list.findIndex(item => item[idKey] === payload[idKey])
      ~index ? state.list.splice(index, 1, payload) : state.list.push(payload)
    },

    removeListItem (state, id) {
      const index = state.list.findIndex(item => item[idKey] === id)
      ~index && state.list.splice(index, 1)
    },

    ...mutations
  }
}
