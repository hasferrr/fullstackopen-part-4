const jwt = require('jsonwebtoken')
const Blog = require("../models/blog")
const User = require("../models/user")
const { SECRET } = require('../utils/config')

const initialBlogs = [
  {
    title: 'SICP',
    author: 'hasferrr',
    url: 'http://parentheses.com',
    likes: 999
  },
  {
    title: 'Functional Progarmming',
    author: 'hasferrr',
    url: 'http://immutable.com',
    likes: 777
  },
]

const fetchAllBlog = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const initialUsers = [
  {
    username: 'person',
    password: 'something',
    name: 'person',
  },
]

const fetchAllUser = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getUserToken = user => {
  const userToken = jwt.sign({
    username: user.username,
    id: user.id,
  }, SECRET)
  return userToken
}

module.exports = {
  initialBlogs,
  fetchAllBlog,
  initialUsers,
  fetchAllUser,
  getUserToken,
}