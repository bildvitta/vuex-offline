const isObject = value => typeof value === 'object' && !Array.isArray(value) && value !== null

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const comb = date => {
  if (!date) {
    date = new Date()
  }

  const uuid = uuidv4()
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12)
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12)

  return uuid.replace(uuid.slice(0, 13), comb)
}

export {
  isObject,
  comb
}
