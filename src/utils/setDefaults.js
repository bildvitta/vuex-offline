export default function (defaults = {}) {
  const response = {}

  for (const key in defaults) {
    const value = defaults[key]
    response[key] = typeof value === 'function' ? value() : value
  }

  return response
}
