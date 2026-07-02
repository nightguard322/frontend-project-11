import i18next from 'i18next';
import config from './configs/i18next.js'
import { proxy } from 'valtio/vanilla'

const state = proxy({
    form: { 
        fields: {
            url: {}
        },
        errors: {},
        isValid: true,
    },
    loaded: {
        i18: false
    }
})

const i18nextSetUp = () => {
    i18next.init({
        debug: true,
        config
    }).then(() => {
        state.loaded.i18 = true
    })
}

export {state, i18nextSetUp}