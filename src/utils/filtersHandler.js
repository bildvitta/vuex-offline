export default class {
  constructor({ receivedFilters, filtersList, receivedSearch = '', searchList, fieldsList }) {
    this.fieldsList = fieldsList
    this.filtersList = filtersList
    this.receivedFilters = receivedFilters
    this.receivedSearch = receivedSearch
    this.searchList = searchList
  }

  getFilterFields () {
    const filters = {}

    for (const filter of this.filtersList) {
      if (!this.fieldsList[filter]) {
        throw new Error(`Filter "${filter}" doesn't exists.`)
      }

      filters[filter] = this.fieldsList[filter]
    }

    return filters
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
