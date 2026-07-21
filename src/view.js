import { setIsRead, setActiveFeed, getActiveFeed} from './models/appState.js'
import { subscribe, snapshot } from 'valtio/vanilla'
import { handleFormData } from './feedService.js'
import i18next from 'i18next'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as bootstrap from 'bootstrap';

const baseClassList = 'text-secondary form-message'
const items = {
  form: document.querySelector('#rss-form'),
  feeds: document.querySelector('#feeds'),
  posts: document.querySelector('#posts'),
  messageBox: document.querySelector('.form-message')
}

const renderFormErrors = (errors, messageBox) => {
  messageBox.innerHTML = ''
  messageBox.classList = `${baseClassList} text-danger`
  const errorsList = document.createElement('ul')
  errors.forEach((errorKey) => {
    const li = document.createElement('li')
    li.textContent = i18next.t(errorKey)
    errorsList.append(li)
  })
  messageBox.append(errorsList)
}

const renderFormSuccess = (messageBox) => {
  messageBox.innerHTML = ''
  messageBox.classList = `${baseClassList} text-success`
  messageBox.textContent = i18next.t('rssForm.messages.success')
}

const createContainer = () => {
  const container = document.createElement('ul')
  container.classList.add('list-unstyled')
  return container
}

const renderActivePosts = (state) => {
  console.log('Выполняется рендер постов')
  const activeFeed = getActiveFeed(state.feeds)
  if (!activeFeed) return
  console.log(activeFeed, 'active feed')
  const activeFeedPosts = state.posts.byFeedId[activeFeed]

  renderPosts(activeFeedPosts)
  renderFormSuccess(items.messageBox) //???
}

const addModalWindow = (post) => {
    const modalEl = document.querySelector('.modal');
    modalEl.querySelector('.modal-title').textContent = post.title;
    modalEl.querySelector('.modal-body').innerHTML = post.description;
    const modal = new bootstrap.Modal(document.querySelector('.modal'));
    modal.show()
}

const renderPosts = (posts) => {
  const postsContainer = createContainer()
  postsContainer.addEventListener('click', e => {
    e.preventDefault()
    const link = e.target.closest('#post-title-link')
    const url = link.dataset.url
    const post = posts.find(p => p.link === url)
    setIsRead(post)

    const titleLink = link.querySelector('a')
    titleLink.classList = 'fw-normal'
    addModalWindow(post)
  })

  posts.forEach(post => {
    const postContainer = document.createElement('li')
    postContainer.dataset.url = post.link
    postContainer.id = 'post-title-link'

    postContainer.datasetBsToggle = "modal"
    postContainer.datasetBsTarget = "#staticBackdrop"
    postContainer.classList.add('d-flex', 'justify-content-between', 'mb-2')

    const title = document.createElement('a')
    title.textContent = post.title
    title.href = '#'
    title.classList = post.isRead ? 'fw-normal' : 'fw-bold'

    const button = document.createElement('button')
    button.classList.add('btn', 'btn-outline-primary')
    button.textContent = 'Просмотр'

    postContainer.append(title, button)
    postsContainer.append(postContainer)
  })
  items.posts.replaceChildren(postsContainer)
}
const renderFeeds = (state) => {
  const feedsContainer = createContainer()
  state.feeds.list.forEach(feed => {
    const feedContainer = document.createElement('li')

    switch (feed.status) {
      case 'loading':
        feedContainer.textContent = 'Загрузка'
        break
      case 'success':

        const title = document.createElement('h6')
        title.textContent = feed.title

        const desc = document.createElement('span')
        desc.textContent = feed.description

        feedContainer.classList.add('btn', 'p-0', 'text-start')
        feedContainer.addEventListener('click', () => {
          console.log('click на фид')
          setActiveFeed(state.feeds, feed.id)
        })
        feedContainer.append(title, desc)
        break
      case 'error':
        feedContainer.textContent = 'Ошибка загрузки'
        break
    }
    feedsContainer.append(feedContainer)
  })
  items.feeds.replaceChildren(feedsContainer)
}

export function initView(state) {
  subscribe(state.form, () => {
    const snap = snapshot(state)
    const currentErrors = snap.form.errors
    if (currentErrors.length > 0) {
      renderFormErrors(currentErrors, items.messageBox)
      return
    }
  })

  subscribe(state.feeds, () => {
    renderFeeds(state)
    renderActivePosts(state)
  })

  // subscribe(state.posts, () => {
    
  // })

  items.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    handleFormData(formData, state)
  })
}
