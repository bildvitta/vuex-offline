import FiltersHandler from '../filtersHandler'
import CollectionHandler from '../utils/collectionHandler'
import RelationsHandler from '../utils/relationsHandler'

export default class {
  constructor (filters = {}, collection, collections) {
    this.collectionHandler = new CollectionHandler(collection)
    this.fieldsWithRelation = this.collectionHandler.getFieldsWithRelation()
    this.collections = collections
    this.collection = collection
    this.relationsHandler = new RelationsHandler(collection, collections)

    // const {
    //   receivedFilters,
    //   filtersList,
    //   receivedSearch,
    //   searchList
    // } = filters

    // this.filtersHandler = new FiltersHandler(filters)
    // this.fieldsWithRelation = collection.getFieldsWithRelation()
    // this.database = database
  }

  getQuery () {
    return this.filtersHandler.transformQuery()
  }

  getFields () {
   return this.relationsHandler.setOptionsInFieldsWithRelations()
  }
}
