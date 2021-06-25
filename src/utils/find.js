import { database } from '../index.js'

/**
 * @param {string} name
 * @param {object} query={object}
 * @returns {promise}
 * @example find('users', { isActive: true })
 */
export default function (name, query = {}) {
  return database.collections[name].find({ selector: query }).exec()
}
