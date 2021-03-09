// TODO hora não está em uso.

import Ajv from 'ajv'
import { requestIdleCallbackIfAvailable } from 'rxdb/dist/lib/util'

import FormatError from '../utils/formatError'

const validatorCache = new Map()
const ajv = new Ajv({ strict: false, allErrors: true })
const ajvErrors = require('ajv-errors')

ajvErrors(ajv)

function _getValidator (rxSchema) {
  const hash = rxSchema.hash;

  if (!validatorCache.has(hash)) {
    const validator = ajv.compile(rxSchema.jsonSchema)
    validatorCache.set(hash, validator)
  }

  return validatorCache.get(hash)
}

function validate (obj) {
  const useValidator = _getValidator(this)
  const isValid = useValidator(obj)

  if (isValid) {
    return obj
  }

  const formatErrors = new FormatError({
    errors: normalizeErrors(useValidator.errors)
  })

  throw {
    response: {
      data: {
        errors: normalizeErrors(useValidator.errors)
      }
    },
    obj: obj,
    schema: this.jsonSchema
  }
}

function runAfterSchemaCreated (rxSchema) {
  requestIdleCallbackIfAvailable(() => _getValidator(rxSchema))
}

const prototypes = {
  RxSchema (proto) {
    proto.validate = validate
  }
}

const hooks = {
  createRxSchema: runAfterSchemaCreated
}

function normalizeErrors (receivedErrors) {
  const normalized = {}

  for (const error of receivedErrors) {
    const { message, params: { errors } } = error
    const key = errors[0].params.missingProperty

    normalized[key] = message
  }

  return normalized
}

const CustomValidator = {
  name: 'custom-validator',
  rxdb: true,
  prototypes,
  hooks
}

export {
  ajv,
  ajvErrors,

  hooks,
  normalizeErrors,
  prototypes,
  runAfterSchemaCreated,
  validate,

  // plugin
  CustomValidator
}
