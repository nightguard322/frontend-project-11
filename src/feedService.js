import { state } from './models/appState.js'
import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'
import { PROXY_API_CONFIG } from './config/proxy.js'
import axios from 'axios'
import i18next from 'i18next'

const fetch = (url) => {
  const targetUrl = encodeURIComponent(url)
  const proxyUrl = `${PROXY_API_CONFIG.BASE_PROXY_URL}?url=${targetUrl}`
  return axios.get(proxyUrl)
  .then(response => {
    const xmlString = response.data.content
    const parser = new DOMParser()
    const xmlDOM = parser.parseFromString(xmlString, "text/xml")
    if (xmlDOM.querySelector('parseerror')) {
      throw new Error('Wrong xml doc')
    }

    const title = xmlDOM.querySelector("channel > title")?.textContent || i18next.t('defaultTitle')
    const items = Array.from(querySelectorAll('item')).map(item => ({
      title: item.querySelector('title')?.textContent,
      link: item.querySelector('link')?.textContent,
      description: item.querySelector('description')?.textContent
    }))
    return {title, items}
  })
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
    const id = uniqueId()
    state.feeds.push({ //не полные данные, надо fetch
      id,
      url: fields.url,
      status: 'loading',
      title: "Загрузка"
    })  

    fetch(feed.url).then(({title, items}) => {
      state.feeds[id].status = 'success'
      state.feeds[id].title = title

      state.posts.byFeedId[id] = items

      if (!state.feeds.activeId) {
        state.feeds.activeId = id
      }
    })
  })
}

export { handleFormData, validate, setActiveFeed}
