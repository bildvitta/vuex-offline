export default function (fields = {}, type, callback) {
  const filteredFields = {}

  for (const key in fields) {
    const field = fields[key]

    if (field.type === type) {
      filteredFields[key] = field
      callback === 'function' && callback(field)
    }
  }

  return filteredFields
}
