import ParseHandler from './parseHandler'

export default class {
  constructor({ receivedFilters, filtersList, receivedSearch = '', searchList, fieldsList }) {
    this.fieldsList = fieldsList
    this.filtersList = filtersList
    this.receivedFilters = receivedFilters
    this.receivedSearch = receivedSearch
    this.searchList = searchList
    this.parseHandler = new ParseHandler()
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

  _transformedQueryObject (originalObject) {
    const object = originalObject || {}

    return {
      transform (newObject) {
        Object.assign(object, newObject)

        return this
      },

      getTransformed () {
        return object
      }
    }
  }

  _setDefaultValueToQueryOperator (queryOperator, value) {
    const defaultValues = {
      $all: [value],
      $eq: this.parseHandler.parseBoolean(value)
    }

    if (!(queryOperator in defaultValues)) {
      return value
    }

    return defaultValues[queryOperator]
  }

  transformQuery () {
    const transformedQuery = {}

    for (const item of this.filtersList) {
      const filterField = this.fieldsList[item]
      const transformedQueryObject = this._transformedQueryObject(
        transformedQuery[filterField.queryOrigin || item]
      )

      if (this.receivedFilters[item]) {
        transformedQuery[filterField.queryOrigin || item] = transformedQueryObject.transform(
          filterField.queryOperator
            ? {
              [filterField.queryOperator]: this._setDefaultValueToQueryOperator(
                filterField.queryOperator, this.receivedFilters[item]
              )
            }
            : { $regex: `.*${this.receivedSearch || this.receivedFilters[item]}.*` }
        ).getTransformed()

        continue
      }

      if (this.receivedSearch && filterField.search) {
        transformedQuery[filterField.queryOrigin || item] = transformedQueryObject.transform(
          { $regex: `.*${this.receivedSearch}.` }
        ).getTransformed()
      }
    }

    return {
      selector: {
        ...transformedQuery
      }
    }
  }
}
