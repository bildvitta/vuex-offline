import setOptions from './setOptions.js'

export default async function ({ fields, idKey, parent, relationships }) {
  fields = JSON.parse(JSON.stringify(fields))

  for (const key in relationships) {
    const relationship = relationships[key]
    const { ref } = relationship

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
