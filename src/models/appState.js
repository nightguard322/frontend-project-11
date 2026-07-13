import { proxy } from 'valtio/vanilla'

const setActiveFeed = (id) => {
  state.feeds.activeId = id
}

const state = proxy({
    form: {
        fields: {
            url: {},
        },
        errors: [],
        isValid: true,
    },
    feeds: { activeId: null, list: []},//{id: 123, url: http://url.url, status: 'loading'|'success', 'error'}
    posts: {
        byFeedId: {}
    } //post_id = 123, title = 'test', content = 'test content'
        
})

export { state, setActiveFeed }
