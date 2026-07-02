import * as yup from 'yup'

const schema = yup.object().shape({
  url: yup.string()
    .trim()
    .url('rssForm.errors.invalid_url')
    .required('rssForm.errors.url_required')
})

export { schema }