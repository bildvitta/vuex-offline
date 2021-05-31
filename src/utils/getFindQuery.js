import parseJSON from './parseJSON.js'

export default function (moduleFilters = {}, { filters, search }) {
  const { queryOperators, search: searchFilter } = moduleFilters
  const filtersQuery = {}

  for (const name in filters) {
    const filter = filters[name]
    const queryOperator = queryOperators[name]

    if (!queryOperator) {
      throw new Error(`The queryOperator is missing for filter "${name}".`)
    }

    if (typeof queryOperator === 'function') {
      const { value, operator } = queryOperator(filter) || {}
      filtersQuery[name] = { [operator || '$regex']: parseJSON(value) }

      continue
    }

    filtersQuery[name] = { [queryOperator]: parseJSON(filter) }
  }

  if (search) {
    filtersQuery.$or = (searchFilter || []).map(
      item => ({ [item]: { $regex: new RegExp(`^${search}$`, 'i') } })
    )
  }

  console.log(filtersQuery)

  return {
    selector: { ...filtersQuery }
  }
}
