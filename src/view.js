import { state } from "./models/appState.js";
import { subscribe, snapshot } from 'valtio/vanilla'
import { keyBy, has, isEmpty } from 'es-toolkit/compat'
import i18next from "./config/i18next.js";

const baseClassList = 'text-secondary form-message'

const renderErrors = (errors, messageBox) => {
    messageBox.innerHTML = ''
    messageBox.classList = `${baseClassList} text-danger`
    const errorsList = document.createElement('ul')
    errors.forEach(errorKey => {
        const li = document.createElement('li')
        li.textContent = i18next.t(errorKey)
        errorsList.append(li)
    })
    messageBox.append(errorsList)
}

const renderSuccess = (messageBox) => {
    messageBox.innerHTML = ''
    messageBox.classList = `${baseClassList} text-success`
    messageBox.textContent = i18next.t('messages.success')
}

export function initView () {
    subscribe(state, () => {
        const currentErrors = snapshot(state)
        const messageBox = document.querySelector('.form-message')
        if (currentErrors.length > 0) {
            renderErrors(currentErrors, messageBox)
        } else {
            renderSuccess(messageBox)
        }
    })

    const form = document.querySelector('#rss-form')
    form.addEventListener('submit', (e) => { //просто заполнение состояния
        e.preventDefault()
        const formData = new FormData(form)
        handleFormData(formData)
    })
}
