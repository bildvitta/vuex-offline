import FormatError from './formatError'
import CollectionHandler from './collectionHandler'

export default class {
  constructor(rxError, collection) {
    this.errors = rxError.parameters.errors
    this.schema = rxError.parameters.schema
    this.collectionHandler = new CollectionHandler(collection)
    this.customFields = this.collectionHandler.getCustomFields()

    return new FormatError({
      errors: this.setErrors()
    })
  }

  getErrorMessagesFromCustomFields () {
    const errorMessages = {}

    for (const key in this.customFields) {
      if (this.customFields[key].errorMessage) {
        errorMessages[key] = this.customFields[key].errorMessage
      }
    }

    return errorMessages
  }

  setErrors () {
    const errors = {}
    const customErrors = this.getErrorMessagesFromCustomFields()

    for (const error of this.errors) {
      const { field } = error
      const key = field.split('.')[1]

      errors[key] = customErrors[key]
    }

    return errors
  }
}
