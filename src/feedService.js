import { state } from './models/appState.js'
import { validate } from './services/validator.js'
import { createSchema } from './schemas/rss.js'
import { uniqueId } from 'es-toolkit/compat'
import { PROXY_API_CONFIG } from './config/proxy.js'
import axios from 'axios'
import i18next from 'i18next'

const fetchFeed = (url) => {
  const targetUrl = encodeURIComponent(url)
  const proxyUrl = `${PROXY_API_CONFIG.BASE_PROXY_URL}${targetUrl}`
  return axios.get(proxyUrl)
}

const autoRefreshRss = () => {
  const DELAY = 1000 * 30

  const checkFeeds = (feedIndex) => {
    const feeds = state.feeds.list
    if (feeds.length <= feedIndex) { //l = 0  i = 0 ! l = 2 i = 0
      setTimeout(autoRefreshRss, DELAY)
      return
    }
    const feed = feeds[feedIndex]
    fetchFeed(feed.url)
    .then(response => {
      const rssDOM = parseXML(response)
      const items = Array.from(rssDOM.querySelectorAll('item'))
      const posts = state.posts.byFeedId[feed.id] ?? []
      const newPosts = items.filter(item => 
        !posts.some(post => 
          post.link === item.querySelector('link')?.textContent)
        )
      if (newPosts.length > 0) {
        console.log('We are fetching new posts with renew process')
        console.log('new posts: ', newPosts)
        const newPostsData = getPosts(newPosts)
        state.posts.byFeedId[feed.id] = [...posts, ...newPostsData];
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
  const xmlDOM = parser.parseFromString(xmlString, "text/xml")
  if (xmlDOM.querySelector('parsererror')) {
    throw new Error('Wrong xml doc in')
  }
  return xmlDOM
}

const getPosts = (postsDOM) => {
  return Array.from(postsDOM).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
    isRead: false
  }))
}

const extractData = (xmlDOM) => {
  const title = xmlDOM.querySelector("channel > title")?.textContent || i18next.t('feeds.defaultTitle')
  const description = xmlDOM.querySelector("channel > description")?.textContent || i18next.t('feeds.defaultTitle')
  const postsDOM = xmlDOM.querySelectorAll('item')
  console.log('We are fetching posts from new feed')
  const postsData = getPosts(postsDOM)
  return {title, description, posts: postsData}
}
const loadFeedData = (url, currentFeed) => {
  fetchFeed(url)
    .then(response => parseXML(response))
    .then(xml => extractData(xml))
    .then(({title, description, posts}) => {
      currentFeed.status = 'success'
      currentFeed.title = title
      currentFeed.description = description
      state.posts.byFeedId[currentFeed.id] = posts

      if (!state.feeds.activeId) {
        state.feeds.activeId = currentFeed.id
      }
    })
    .catch(e => {
      currentFeed.status = 'error'
      console.log(e)
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
      title: "Загрузка",
    })  
    const currentFeed = feeds.find(f => f.id === id)

    loadFeedData(fields.url, currentFeed)
  })
}

export { handleFormData, validate, autoRefreshRss}

