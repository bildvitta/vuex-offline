export default function ({ state }) {
  return {
    list: [],
    filters: {},
    totalPages: 0,

    ...state
  }
}
