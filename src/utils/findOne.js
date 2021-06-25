import { database } from '../index.js'

/**
 * @param {string} name
 * @param {object | string} query={object | string}
 * @returns {promise}
 * @example findOne('users', 'my_uuid')
 */
export default function (name, query = {}) {
  const queryParam = typeof query === 'object' ? { selector: query } : query

  return database.collections[name].findOne(queryParam).exec()
}
