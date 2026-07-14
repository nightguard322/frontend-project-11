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
    const xmlString = response.data.contents
    const parser = new DOMParser()
    const xmlDOM = parser.parseFromString(xmlString, "text/xml")
    if (xmlDOM.querySelector('parsererror')) {
      throw new Error('Wrong xml doc in')
    }
    const title = xmlDOM.querySelector("channel > title")?.textContent || i18next.t('feeds.defaultTitle')
    const description = xmlDOM.querySelector("channel > description")?.textContent || i18next.t('feeds.defaultTitle')
    const posts = Array.from(xmlDOM.querySelectorAll('item')).map(item => ({
      title: item.querySelector('title')?.textContent,
      link: item.querySelector('link')?.textContent,
      description: item.querySelector('description')?.textContent
    }))
    return {title, description, posts}
  })
}


const handleFormData = (data) => {
  const fields = Object.fromEntries(data.entries()) //formData с формы, то, что пришло
  const form = state.form
  const feeds = state.feeds.list
  const schema = createSchema(feeds)
  validate(schema, fields).then((errors) => {
    form.fields = { ...form.fields, ...fields }
    form.errors = []
    if (errors.length > 0) {
      form.errors = errors
      return
    }
    const id = uniqueId()
    feeds.push({ //не полные данные, надо fetch
      id,
      url: fields.url,
      status: 'loading',
      title: "Загрузка"
    })  
    const currentFeed = feeds.find(f => f.id === id)
    fetch(fields.url)
    .then(({title, description, posts}) => {
      currentFeed.status = 'success'
      currentFeed.title = title
      currentFeed.description = description
      
      state.posts.byFeedId[id] = posts

      if (!feeds.activeId) {
        feeds.activeId = id
      }
    })
    .catch(e => {
      currentFeed.status = 'error'
      console.log(e)
    })
  })
}

export { handleFormData, validate}
