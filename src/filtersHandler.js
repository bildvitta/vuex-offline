export default class {
  constructor({ receivedFilters, filtersList, receivedSearch = '', searchList }) {
    this.receivedFilters = receivedFilters
    this.filtersList = filtersList
    this.receivedSearch = receivedSearch
    this.searchList = searchList
  }

  transformQuery () {
    const transformedQuery = {}

    for (const item of this.filtersList) {
      if (this.receivedFilters[item]) {
        transformedQuery[item] = { $regex: `.*${this.receivedFilters[item]}.*` }
      }
    }

    for (const item of this.searchList) {
      if (this.receivedSearch) {
        transformedQuery[item] = { $regex: `.*${this.receivedSearch}.*` }
      }
    }

    return {
      selector: {
        ...transformedQuery
      }
    }
  }
}
