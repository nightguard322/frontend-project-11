import { proxy } from 'valtio/vanilla'

const setActiveFeed = (id) => {
  state.feeds.activeId = id
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
        posts: { byFeedId: {} }
    });
}


export { createAppState, setActiveFeed, setIsRead }
