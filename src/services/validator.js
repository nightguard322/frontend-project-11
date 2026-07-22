const validate = (schema, fields) => {
  return schema.validate(fields, { abortEarly: false })
    .then(() => [])
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return e.inner.map(error => error.message)
      }
      throw e
    })
}

export { validate }
