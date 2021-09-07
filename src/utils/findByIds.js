import { database } from '../index.js'
/**
 * @param {string} name
 * @param {string[]} ids
 * @returns {Promise<Map>}
 * @example findByIds('users', ['uuid-1', 'uuid-2'])
 */
export default function (name, ids) {
  return database.collections[name].findByIds(ids)
}
