import i18next from 'i18next'
import resources from './config/i18next.js'

const i18nextSetUp = () => {
  return i18next.init({
    debug: true,
    lng: 'en',
    resources,
  })
}

export { i18nextSetUp }
