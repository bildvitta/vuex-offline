export default function (object, callback = () => {}) {
  for (const key in object) {
    const validation = callback(object[key])

    if (validation) {
      delete object[key]
    }
  }

  return object
}
