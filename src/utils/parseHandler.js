export default class {
  parseValue (value) {
    try { return JSON.parse(value) } catch { return value }
  }

  parseBoolean (value) {
    return ['true', 'false'].some(item => item === value) ? this.parseValue(value) : value
  }
}
