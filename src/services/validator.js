import { schema } from "../schemas/rss"
import { state } from "../init"

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false })
    return {}
  }
  catch (e) {
    if (e.name === 'ValidationError') {
      return e.inner.map(error => error.message)
    }
    throw e
  }
}

const handleFormData = (data) => {
  state.form.fields = {...state.form.fields, ...data}
  state.form.errors = validate(data) //разобраться со срабатываением сохранения и рендера
}

export { validate }
