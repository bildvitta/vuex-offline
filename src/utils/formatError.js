export default class {
  constructor ({ errors, status = { code: 400 } } = {}) {
    return {
      response: {
        data: {
          errors,
          status
        }
      }
    }
  }
}
