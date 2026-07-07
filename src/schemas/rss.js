import * as yup from 'yup'

export const createSchema = (existingData = []) => {
  return yup.object().shape({
  url: yup.string()
    .url('rssForm.errors.invalid_url')
    .required('rssForm.errors.url_required')
    .test(
      'test-is-unique',
      'url_exists',
      function (value) {
        if (!value) return true
        const feeds = Object.values(existingData)
        return !feeds.some(
          feed => feed.url.toLowerCase() === value.toLowerCase()
        )
      }
    )
  })
}

