import { state } from './models/appState.js'
import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'
import { PROXY_API_CONFIG } from './config/proxy.js'
import axios from 'axios'

const fetch = (url) => {
  const targetUrl = encodeURIComponent(url)
  const proxyUrl = `${PROXY_API_CONFIG.BASE_PROXY_URL}?url=${targetUrl}`
  return axios.get(proxyUrl)
}


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
    const feed = { //не полные данные, надо fetch
      id: uniqueId(),
      url: fields.url,
      status: 'loading'
    }

    fetch(feed.url).then(data => {
      feed.status = 'success'
      feed = {...feed, ...data}
      state.feeds.list.push(feed)
    })

  })
}

export { handleFormData, validate }
