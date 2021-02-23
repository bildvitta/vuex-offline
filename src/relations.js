// "posts": {
//   "name": "posts",
//   "type": "select",
//   "label": "oneToMany"
// }
// authors

import Models from './models'

export default class Relations {
  constructor (models) {
    this.models = new Models(models)
    this.relationsList = this.getAllRelations()
    this.formattedRelations = {}
  }

  getRelationsFromFields (fields) {
    const formattedFields = {}

    for (const key in fields) {
      if (fields[key].__relation) {
        formattedFields[key] = fields[key]
      }
    }

    return formattedFields
  }

  getRelationByModelName (name) {
    return this.relationsList[name]
  }

  getAllRelations () {
    const relations = {}

    for (const key in this.models.normalizedModels) {
      relations[key] = this.models.normalizedModels[key].schema.relations
    }

    return relations
  }

  formatRelations (relations, relationKey) {
    const formattedRelations = {}

    const relationsTypes = {
      manyToOne: {},
      manyToMany: {}
    }

    for (const key in relations) {
      const relation = relations[key]
    }

    return formattedRelations
  }

  handleRelations () {
    const relations = {}

    for (const key in this.relationsList) {
      relations[key] = this.formatRelations(this.relationsList[key], key)
    }

    return relations
  }

  formatOneToMany () {

  }

  formatManyToMany () {

  }
}
