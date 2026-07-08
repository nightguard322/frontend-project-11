import { state } from './models/appState.js'
import { subscribe, snapshot } from 'valtio/vanilla'
import { handleFormData } from './feedService.js'
import i18next from 'i18next'

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
  //feeds = [{}, {}
  const feedsContainer = document.createDocument('ul')
  state.feeds.forEach(feed => {
    const feedContainer = document.createElement('li')

    const title = document.createElement('h3')
    title.textContent = feed.title

    const desc = document.createElement('span')
    desc.textContent = feed.description

    feedContainer.append(title, desc)
    feedsContainer.append(feedContainer)
  })
}

// post logic:     const feedContainer = document.createElement('li')
//     feedContainer.classList = 'd-flex justify-content-between align-items-center mb-3 border-bottom pb-2'

//     const title = document.createElement('a')
//     title.classList = 'h5 mb-0 me-3'
//     title.textContent = feed.title
    
//     const 
export function initView() {
  subscribe(state.form, () => {
    const snap = snapshot(state)
    const currentErrors = snap.form.errors
    const messageBox = document.querySelector('.form-message')
    if (currentErrors.length > 0) {
      renderFormErrors(currentErrors, messageBox)
      return
    }
    renderFormSuccess(messageBox)
    renderFeeds()
  })

  subscribe(state.feeds, () => {

  })


  items.form.addEventListener('submit', (e) => { // просто заполнение состояния
    e.preventDefault()
    const formData = new FormData(form)
    handleFormData(formData)
  })


}
