const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany()

  const initialBlogs = [
    {
      title: "SICP",
      author: "hasferrr",
      url: "http://parentheses.com",
      likes: 999
    },
    {
      title: "Functional Progarmming",
      author: "hasferrr",
      url: "http://immutable.com",
      likes: 777
    },
  ]

  for (let i = 0; i < initialBlogs.length; i++) {
    let blogObject = new Blog(initialBlogs[i])
    await blogObject.save()
  }
})

test('HTTP GET: blog are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier of the blog is "id"', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})