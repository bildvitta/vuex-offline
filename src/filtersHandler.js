export default class {
  constructor(receivedFilters = {}, filtersList = []) {
    this.receivedFilters = receivedFilters
    this.filtersList = filtersList
  }

  transformQuery () {
    console.log('aaa')
    const transformedQuery = {}

    for (const item of this.filtersList) {
      if (this.receivedFilters[item]) {
        transformedQuery[item] = { $regex: `.*${this.receivedFilters[item]}.*` }
      }
    }

    return {
      selector: {
        ...transformedQuery
      }
    }
  }
}
