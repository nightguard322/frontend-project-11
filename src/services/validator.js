import { schema } from "../schemas/rss"
import { state } from "../init"

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false })
    return {}
  }
  catch (e) {
    return keyBy(e.inner, 'path')
  }
}

export { validate }