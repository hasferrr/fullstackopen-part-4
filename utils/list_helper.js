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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authorAndBlogNumber = {}

  for (let i = 0; i < blogs.length; i++) {
    if (authorAndBlogNumber[blogs[i].author] === undefined) {
      authorAndBlogNumber[blogs[i].author] = 1
    } else {
      authorAndBlogNumber[blogs[i].author]++
    }
  }

  const author = Object.keys(authorAndBlogNumber)
  const blogsNumber = Object.values(authorAndBlogNumber)
  const maxAndIndex = { max: -1, index: -1 }

  for (let i = 0; i < author.length; i++) {
    if (blogsNumber[i] > maxAndIndex.max) {
      maxAndIndex.max = blogsNumber[i]
      maxAndIndex.index = i
    }
  }
  return { author: author[maxAndIndex.index], blogs: maxAndIndex.max }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}