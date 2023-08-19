const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).send({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(400).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  unknownEndpoint,
}