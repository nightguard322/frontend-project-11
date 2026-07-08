import { proxy } from 'valtio/vanilla'

export const state = proxy({
    form: {
        fields: {
            url: {},
        },
        errors: [],
        isValid: true,
    },
    feeds: []
        //{id: 123, url: http://url.url, ...}
})
