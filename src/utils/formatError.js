export default class {
  constructor ({ errors, status = {} } = {}) {
    return {
      response: {
        data: {
          errors,
          status: { code: 400 }
        }
      }
    }
  }
}
