import { state } from './models/appState.js'
import { subscribe, snapshot } from 'valtio/vanilla'
import { handleFormData } from './feedService.js'
import i18next from 'i18next'
import { setActiveFeed } from './models/appState.js'

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

const renderFeeds = () => {
  items.feeds.innerHTML = ''
  
  const feedsContainer = document.createElement('ul')
  state.feeds.list.forEach(feed => {
    const feedContainer = document.createElement('li')

    switch (feed.status) {
      case 'loading':
        feedContainer.textContent = 'Загрузка'
        break
      case 'success':
        const title = document.createElement('a')
        title.textContent = feed.title
        title.href = '#'
        title.addEventListener('click', () => {
          setActiveFeed(feed.id) //импортирован с модели со state
        })
        const desc = document.createElement('p')
        desc.textContent = feed.description
        feedContainer.append(title, desc)
        renderFormSuccess(items.messageBox)
        break
      case 'error':
        feedContainer.textContent = 'Ошибка загрузки'
        break
    }
    feedsContainer.append(feedContainer)
  })
  items.feeds.append(feedsContainer)
}

export function initView() {
  subscribe(state.form, () => {
    const snap = snapshot(state)
    const currentErrors = snap.form.errors
    if (currentErrors.length > 0) {
      renderFormErrors(currentErrors, items.messageBox)
      return
    }
  })
}
  subscribe(state.feeds, () => {
    renderFeeds()
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
