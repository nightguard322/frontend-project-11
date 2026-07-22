import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'
import { PROXY_API_CONFIG } from './config/proxy.js'
import axios from 'axios'
import i18next from 'i18next'
import { setActiveFeed } from './models/appState.js'

const fetchFeed = (url) => {
  const targetUrl = encodeURIComponent(url)
  const proxyUrl = `${PROXY_API_CONFIG.BASE_PROXY_URL}${targetUrl}`
  return axios.get(proxyUrl) // промис
}

const autoRefreshRss = (state) => {
  const DELAY = 1000 * 30
  const checkFeeds = (feedIndex) => {
    const feeds = state.feeds.list
    if (feeds.length <= feedIndex) {
      setTimeout(() => autoRefreshRss(state), DELAY)
      return
    }
    const feed = feeds[feedIndex]
    fetchFeed(feed.url)
      .then((response) => {
        const rssDOM = parseXML(response)
        const items = Array.from(rssDOM.querySelectorAll('item'))
        const posts = state.posts.byFeedId[feed.id] ?? []
        const newPosts = items.filter(item =>
          !posts.some(post =>
            post.link === item.querySelector('link')?.textContent),
        )
        if (newPosts.length > 0) {
          const newPostsData = getPosts(newPosts)
          state.posts.byFeedId[feed.id] = [...posts, ...newPostsData]
        }
      })
      .catch(e => console.log(e))
      .finally(() => checkFeeds(feedIndex + 1))
  }

  checkFeeds(0)
}

const parseXML = (response) => {
  const xmlString = response.data.contents
  const parser = new DOMParser()
  const xmlDOM = parser.parseFromString(xmlString, 'text/xml')
  if (xmlDOM.querySelector('parsererror')) {
    throw new Error('rssForm.errors.no_rss')
  }
  return xmlDOM
}

const getPosts = (postsDOM) => {
  return Array.from(postsDOM).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
    isRead: false,
  }))
}

const extractData = (xmlDOM) => {
  const title = xmlDOM.querySelector('channel > title')?.textContent || i18next.t('feeds.defaultTitle')
  const description = xmlDOM.querySelector('channel > description')?.textContent || i18next.t('feeds.defaultTitle')
  const postsDOM = xmlDOM.querySelectorAll('item')
  const postsData = getPosts(postsDOM)
  return { title, description, posts: postsData }
}

const loadFeedData = (url, errorsList) => {
  return fetchFeed(url)
    .then(response => parseXML(response))
    .then(xml => extractData(xml))
    .catch((e) => {
      if (axios.isAxiosError(e)) {
        errorsList.push('rssForm.errors.network_error')
      }
      errorsList.push(e.message)
    })
}

const handleFormData = (data, state) => {
  const fields = Object.fromEntries(data.entries()) // formData с формы, то, что пришло
  const form = state.form
  const feeds = state.feeds.list
  const schema = createSchema(feeds)

  validate(schema, fields)
    .then((errors) => {
      if (errors.length > 0) {
        form.errors = errors
        return
      }

      form.fields = { ...form.fields, ...fields }
      form.errors = []
      return loadFeedData(fields.url, state.form.errors)
    })
    .then((feedData) => {
      if (!feedData) return

      const { title, description, posts } = feedData
      const id = uniqueId()
      feeds.push({
        id,
        url: fields.url,
        status: 'success',
        title,
        description,
      })
      state.posts.byFeedId[id] = posts

      if (!state.feeds.activeId) {
        setActiveFeed(state.feeds, id)
      }
    })
    .catch((e) => {
      form.errors.push(e)
    })
}

export { handleFormData, validate, autoRefreshRss }
