const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany()

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

test('HTTP POST test successfully adds a blog', async () => {
  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
    likes: 555
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
  expect(response.body[2].title).toBe('Full Stack Open')
})

test('likes property is missing, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
  expect(response.body[2].likes).toBe(0)
})

test('verify missing "title" property', async () => {
  const newBlog = {
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({ error: 'missing title property' })
})

test('verify missing "url" property', async () => {
  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({ error: 'missing url property' })
})

afterAll(async () => {
  await mongoose.connection.close()
})