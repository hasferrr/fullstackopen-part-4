const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, fetchAllBlog,
  initialUsers, fetchAllUser, getUserToken } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  // initialize user
  await User.deleteMany()
  const userToBeSaved = new User(initialUsers[0])
  await userToBeSaved.save()

  // initialize blogs
  await Blog.deleteMany()
  const user = (await fetchAllUser())[0]
  for (let i = 0; i < initialBlogs.length; i++) {
    const blogObject = new Blog({ ...initialBlogs[i], user: user.id })
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
  const response = await fetchAllBlog()
  expect(response[0].id).toBeDefined()
})

test('HTTP POST test successfully adds a blog', async () => {
  const user = (await fetchAllUser())[0]
  const userToken = getUserToken(user)

  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
    likes: 555,
    user: user.id,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${userToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await fetchAllBlog()
  expect(response).toHaveLength(initialBlogs.length + 1)
  expect(response[2].title).toBe('Full Stack Open')
})

test('likes property is missing, it will default to the value 0', async () => {
  const user = (await fetchAllUser())[0]
  const userToken = getUserToken(user)

  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
    user: user.id,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${userToken}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await fetchAllBlog()
  expect(response).toHaveLength(initialBlogs.length + 1)
  expect(response[2].likes).toBe(0)
})

test('verify missing "title" property', async () => {
  const user = (await fetchAllUser())[0]
  const userToken = getUserToken(user)

  const newBlog = {
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
    user: user.id,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${userToken}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({ error: 'missing title property' })
})

test('verify missing "url" property', async () => {
  const user = (await fetchAllUser())[0]
  const userToken = getUserToken(user)

  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    user: user.id,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${userToken}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({ error: 'missing url property' })
})

test('deleting a single blog post resource', async () => {
  const user = (await fetchAllUser())[0]
  const userToken = getUserToken(user)

  const beginningData = await fetchAllBlog()
  const id = beginningData[1].id

  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `bearer ${userToken}`)
    .expect(204)

  const newData = await fetchAllBlog()
  expect(newData).toHaveLength(initialBlogs.length - 1)
  expect(newData).toStrictEqual([beginningData[0]])
})

test('updating the information of an individual blog', async () => {
  const beginningData = await fetchAllBlog()
  const id = beginningData[1].id

  await api
    .put(`/api/blogs/${id}`)
    .send({
      title: 'Functional Progarmming',
      author: 'hasferrr',
      url: 'http://immutable.com',
      likes: 778,
      user: beginningData[1].user,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newData = await fetchAllBlog()
  expect(newData[1]).toEqual({ ...beginningData[1], likes: 778 })
})

test('401 Unauthorized: if Authorization token is not provided', async () => {
  const user = (await fetchAllUser())[0]

  const newBlog = {
    title: 'Full Stack Open',
    author: 'University of Helsinki',
    url: 'https://fullstackopen.com/',
    likes: 555,
    user: user.id,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})