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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}