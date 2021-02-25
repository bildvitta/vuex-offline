export default class {
  constructor (filtersList, fieldsList) {
    this.filtersList = filtersList
    this.fieldsList = fieldsList
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
}
