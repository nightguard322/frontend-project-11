import { proxy } from 'valtio/vanilla'

const setActiveFeed = (feeds, id) => {
  feeds.activeId = id
}

const getActiveFeed = (feeds) => {
  console.log('Мы внутри функции получения активного фида', feeds)
  return feeds.activeId
}

const setIsRead = (post) => {
  post.isRead = true
}

const createAppState = () => {
  return proxy({
    form: {
      fields: { url: {} },
      errors: [],
      isValid: true,
    },
    feeds: { activeId: null, list: [] },
    posts: { byFeedId: {} },
  })
}

export { createAppState, setActiveFeed, setIsRead, getActiveFeed }
