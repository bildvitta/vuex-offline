export default function ({ uploads = [], name, payload = {} }) {
  const uploadsPayload = {}

  for (const upload of uploads) {
    uploadsPayload[upload] = payload[upload]
  }

  return {
    name,
    uploadsPayload,
    payload
  }
}
