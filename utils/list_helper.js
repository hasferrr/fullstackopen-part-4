const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => {
  let mostLikes = { likes: -1 }
  for (let i = 0; i < blogs.length; i++) {
    const obj = blogs[i]
    if (obj.likes > mostLikes.likes) {
      mostLikes = { title: obj.title, author: obj.author, likes: obj.likes }
    }
  }
  return mostLikes.likes === -1 ? {} : mostLikes
}

const abstractFunctionForMostSomething = (blogs, typeMost, f) => {
  if (blogs.length === 0) {
    return {}
  }

  const authorAndBlogNumber = {}

  for (let i = 0; i < blogs.length; i++) {
    if (authorAndBlogNumber[blogs[i].author] === undefined) {
      authorAndBlogNumber[blogs[i].author] = f(blogs[i].likes)
    } else {
      authorAndBlogNumber[blogs[i].author] = authorAndBlogNumber[blogs[i].author] + f(blogs[i].likes)
    }
  }

  const author = Object.keys(authorAndBlogNumber)
  const resultNumber = Object.values(authorAndBlogNumber)
  const maxAndIndex = { max: -1, index: -1 }

  for (let i = 0; i < author.length; i++) {
    if (resultNumber[i] > maxAndIndex.max) {
      maxAndIndex.max = resultNumber[i]
      maxAndIndex.index = i
    }
  }

  const returnValue = { author: author[maxAndIndex.index] }
  returnValue[typeMost] = maxAndIndex.max
  return returnValue
}

const mostBlogs = (blogs) => {
  return abstractFunctionForMostSomething(blogs, 'blogs', () => 1)
}

const mostLikes = (blogs) => {
  return abstractFunctionForMostSomething(blogs, 'likes', v => v)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}