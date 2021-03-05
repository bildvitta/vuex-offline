// TODO ainda não está pronto
export default class {
  getNormalizedDocument (changeObject) {
    return changeObject.change.docs.map(doc => this.normalizeDocument(doc))
  }

  normalizeDocument (document) {
    const { _rev, _revisions, ...normalized } = document

    normalized.uuid = normalized._id
    delete normalized._id

    return normalized
  }
}
