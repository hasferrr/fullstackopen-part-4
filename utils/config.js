require('dotenv').config()

const PORT = process.env.PORT || 3003

/** @type {string} */
const MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

/** @type {string} */
const SECRET = process.env.SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
}