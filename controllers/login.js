const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // check username and password
  const user = await User.findOne({ username })
  if (!user) {
    return response.status(401).json({ error: 'invalid username' })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect) {
    return response.status(401).json({ error: 'invalid password' })
  }

  // create token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, SECRET)

  // send token
  response.status(200).json({ token, username: user.name, name: user.name })
})

module.exports = loginRouter