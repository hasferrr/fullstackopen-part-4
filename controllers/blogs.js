const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  // check title and url
  if (body.title === undefined) {
    return response.status(400).json({ error: 'missing title property' })
  }
  if (body.url === undefined) {
    return response.status(400).json({ error: 'missing url property' })
  }

  // get user from the current token
  const user = request.user

  const blog = new Blog({
    ...body,
    user: user.id,
  })

  // save new blog
  const result = await blog.save()

  // save new blog id into user
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  if (!blog) {
    return response.status(400).json({ error: 'blog not found' })
  }
  const blogUserId = blog.user.toString()

  // get user from the current token
  const user = request.user

  // compare blog user id with current user id
  if (blogUserId !== user._id.toString()) {
    return response.status(401).json({ error: 'invalid user' })
  }

  // remove blog
  await Blog.findByIdAndRemove(blogId)

  // remove blog id from User
  user.blogs = user.blogs.filter(id => blogId !== id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter