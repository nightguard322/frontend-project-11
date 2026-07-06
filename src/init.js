import i18next from 'i18next';
import config from './configs/i18next.js'


const i18nextSetUp = () => {
    i18next.init({
        debug: true,
        config
    }).then(() => {
        state.loaded.i18 = true
    })
}

export {state, i18nextSetUp}