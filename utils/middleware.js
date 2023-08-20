const jwt = require("jsonwebtoken")

const { SECRET } = require("./config")
const User = require("../models/user")

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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid tokenEE' })
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
}