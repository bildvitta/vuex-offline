import setOptions from './setOptions.js'

export default async function ({ fields, idKey, parent, relationships, form, id }) {
  fields = JSON.parse(JSON.stringify(fields))

  const methodsModels = {
    fetchList: !form && !id,
    fetchSingleCreate: form && !id,
    fetchSingleEdit: form && id,
    fetchSingleShow: !form && id
  }

  // model with value true
  const model = Object.keys(methodsModels).find(item => methodsModels[item])

  for (const key in relationships) {
    const relationship = relationships[key]
    const { ref, methods } = relationship

    // if there are methods, and it is not the current method returns empty options
    if (methods && methods.length && !methods.includes(model)) {
      fields[key].options = []
      continue
    }

    if (ref) {
      if (!relationship.label) { relationship.label = idKey }
      if (!relationship.value) { relationship.value = idKey }

      const documents = await parent.collections[ref].find().exec()
      fields[key].options = setOptions(documents, relationship)

      continue
    }

    for (const relKey in relationship) {
      const relRef = relationship[relKey].ref
      const documents = await parent.collections[relRef].find().exec()

      fields[key].children[relKey] = {
        options: setOptions(documents, relationship[relKey]),
        ...fields[key].children[relKey]
      }
    }
  }

  return fields
}