import * as yup from 'yup'

export const createSchema = (feeds = []) => {
  return yup.object().shape({
  url: yup.string()
    .url('rssForm.errors.invalid_url')
    .required('rssForm.errors.url_required')
    .test(
      'test-is-unique',
      'rssForm.errors.url_exists',
      function (value) {
        if (!value) return true
        console.log('exists? = ', feeds.some(
          feed => feed.url.toLowerCase() === value.toLowerCase()
        ) )
        return !feeds.some(
          feed => feed.url.toLowerCase() === value.toLowerCase()
        )
      }
    )
  })
}

