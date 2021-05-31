export default function (response) {
  return {
    data: {
      status: { code: 200 },
      ...response
    }
  }
}
