import { RxError } from 'rxdb/dist/es/rx-error.js'
import formatResponse from './formatResponse.js'

// https://www.npmjs.com/package/is-my-json-valid#error-messages
const ptBR = {
  'is required': 'Este campo é obrigatório.',
  // 'is the wrong type': '',
  // 'has additional items': '',
  'must be FORMAT format': 'Este campo precisa ser FORMAT.',
  'must be unique': 'Já existe um registro com este valor.',
  // 'must be an enum value': '',
  // 'dependencies not set': '',
  // 'has additional properties': '',
  // 'referenced schema does not match': '',
  // 'negative schema matches': '',
  // 'pattern mismatch': '',
  // 'no schemas match': '',
  // 'no (or more than one) schemas match': '',
  // 'has a remainder': '',
  'has more properties than allowed': 'Selecione menos propriedades.',
  'has less properties than allowed': 'Selecione mais propriedades.',
  'has more items than allowed': 'Selecione menos itens.',
  'has less items than allowed': 'Selecione mais itens.',
  'has longer length than allowed': 'O valor é muito grande.',
  'has less length than allowed': 'O valor é muito pequeno.',
  'is less than minimum': 'O valor é menor que o mínimo.',
  'is more than maximum': 'O valor é maior que o máximo.'
}

const localize = message => [ptBR[message] || message]
const labelize = label => label.replace('data.', '')

export default function (error, response = {}) {
  if (!(error instanceof RxError)) {
    throw error
  }

  const { errors: databaseErrors, obj: result } = error.parameters
  const errors = {}

  for (const { field, message } of databaseErrors) {
    errors[labelize(field)] = localize(message)
  }

  return {
    response: formatResponse({
      status: { code: 400 }, errors, result, ...response
    })
  }
}
