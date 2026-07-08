import { state } from './models/appState.js'
import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'

const handleFormData = (data) => {
  const fields = Object.fromEntries(data.entries())
  const form = state.form
  const schema = createSchema(state.feeds)
  validate(schema, fields).then((errors) => {
    form.fields = { ...form.fields, ...fields }
    form.errors = []
    if (errors.length > 0) {
      form.errors = errors
      return
    }
    const feed = {
      id: uniqueId(),
      url: fields.url
    }
    state.feeds.push(feed)
  })// разобраться со срабатываением сохранения и рендера
}

export { handleFormData, validate }
