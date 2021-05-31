export default function ({ getters, idKey }) {
  return {
    list: state => state.list,
    filters: state => state.filters,
    totalPages: state => state.totalPages,

    byId: state => id => state.list.find(item => item[idKey] === id),

    ...getters
  }
}
