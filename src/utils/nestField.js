export default function nestField (nested = [], destroyedKey = 'destroyed') {
  if (!Array.isArray(nested)) {
    throw new Error('Please provide a valid array.')
  }

  let index = 0

  function hasNext () {
    return index < nested.length
  }

  function next () {
    return nested[index++]
  }

  while (hasNext()) {
    const current = next()

    if (current[destroyedKey]) {
      index--
      nested.splice(index, 1)
      continue
    }

    for (const key in current) {
      if (Array.isArray(current[key]) && current[key].length) {
        nestField(nested[index - 1][key])
      }
    }
  }

  return nested
}
