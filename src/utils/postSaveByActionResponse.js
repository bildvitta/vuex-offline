export default function ({ uploads = [], name, payload = {} }) {
  const uploadsPaylod = {}

  for (const upload of uploads) {
    uploadsPaylod[upload] = payload[upload]
  }

  return {
    name,
    uploadsPaylod,
    payload
  }
}
