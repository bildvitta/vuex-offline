export default function (documents, { label, value }) {
  return documents.map(document => ({
    label: document[label],
    value: document[value],
    data: document.toJSON()
  }))
}
