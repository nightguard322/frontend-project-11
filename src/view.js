import { state } from "./init";
import { subscribe, snapshot } from 'valtio/vanilla'
import { keyBy, has, isEmpty } from 'es-toolkit/compat'

subscribe(state.errors, () => {
    //обработка ошибок и появление сообщений, отрисовка результата
    const messageBox = document.querySelector('.form-message')
    
    //если успех -   messageBox.classList.add('text-success') и messageBox.textContent = i18n.t('rssForm.messages.success')
    //
    //если ошибка поля вытащить ошибку и messageBox.classList.add('text-alert') messageBox.textContent = i18n.t(`rssForm.errors.${fieldName}`)

})

const form = document.querySelector('rss-form')
form.addEventListener('submit', (e) => { //просто заполнение состояния
    e.preventDefault()
    const formData = new FormData(form)
    handleFormData(formData)
})