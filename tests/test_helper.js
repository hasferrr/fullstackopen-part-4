const Blog = require("../models/blog")

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

module.exports = {
  initialBlogs,
  fetchAllBlog,
  initialUsers,
}