const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const { initialUsers } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany()

  const user = new User(initialUsers[0])
  await user.save()
})

test('missing username', async () => {
  const newUser = {
    password: 'something',
    name: 'person',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({
    "error": "User validation failed: username: Path `username` is required."
  })
})

test('username less than 3 chars', async () => {
  const newUser = {
    username: 'zz',
    password: 'something',
    name: 'person',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({
    "error":
      `User validation failed: username: Path \`username\` (\`${newUser.username}\`) ` +
      `is shorter than the minimum allowed length (3).`
  })
})

test('duplicate username', async () => {
  const newUser = {
    username: initialUsers[0].username,
    password: 'something',
    name: 'person',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toEqual({
    "error":
      `User validation failed: username: Error, expected \`username\` ` +
      `to be unique. Value: \`${newUser.username}\``
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})