import { state } from './models/appState.js'
import { subscribe, snapshot } from 'valtio/vanilla'
import { handleFormData } from './feedService.js'
import i18next from 'i18next'
import { setActiveFeed } from './models/appState.js'

const baseClassList = 'text-secondary form-message'
const items = {
  form: document.querySelector('#rss-form'),
  feeds: document.querySelector('#feeds'),
  posts: document.querySelector('#posts')
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

const renderFeeds = () => {
  feeds.innerHTML = ''
  
  const feedsContainer = document.createElement('ul')
  state.feeds.list.forEach(feed => {
    const feedContainer = document.createElement('li')

    const title = document.createElement('a')
    title.textContent = feed.title
    title.href = '#'
    title.addEventListener('click', () => {
      setActiveFeed(feed.id) //импортирован с модели со state
    })

    const desc = document.createElement('span')
    desc.textContent = feed.description

    feedContainer.append(title, desc)
    feedsContainer.append(feedContainer)
  })
  feeds.append(feedsContainer)
}

export function initView() {
  subscribe(state.form, () => {
    const snap = snapshot(state)
    const currentErrors = snap.form.errors
    const messageBox = document.querySelector('.form-message')
    if (currentErrors.length > 0) {
      renderFormErrors(currentErrors, messageBox)
      return
    }
    handleFeeds()
    // renderFormSuccess(messageBox)
    // renderFeeds()
  })
}
  subscribe(state.feeds, () => {
    state.feeds.forEach(feed => {
      
    })
  })


  items.form.addEventListener('submit', (e) => { // просто заполнение состояния
    e.preventDefault()
    const formData = new FormData(e.target)
    handleFormData(formData)
    //валидация формы
    //валидно - loading (рендер - колесо загрузки), нет - error (рендер - отрисовка сообщения)
    //серверная валидация (рендер - информация), нет - error (рендер - отрисовка сообщения)
    //
})
