import { proxy } from 'valtio/vanilla'

export const state = proxy({
    form: {
        fields: {
            url: {},
        },
        errors: [],
        isValid: true,
    },
    feeds: {
    }
})
