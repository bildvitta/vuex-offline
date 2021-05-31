export default function (code, text) {
  return {
    data: {
      status: { code, text }
    }
  }
}
