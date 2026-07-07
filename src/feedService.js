import { state } from './models/appState.js'
import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'

const handleFormData = (data) => {
  const fields = Object.fromEntries(data.entries())
  const form = state.form
  const schema = createSchema(form.feeds)
  validate(schema, fields).then((errors) => {
    form.fields = { ...state.form.fields, ...fields }
    form.errors = []
    if (errors.length > 0) {
      form.errors = errors
      return
    }
    const feed = {
      id: uniqueId(),
      url: fields.url
    }
    form.feeds = {...form.feeds, feed}
  })// разобраться со срабатываением сохранения и рендера
}

export { handleFormData, validate }
