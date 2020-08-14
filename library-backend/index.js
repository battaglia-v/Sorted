const config = require('./config/config');
const { ApolloServer, UserInputError, gql, AuthenticationError, PubSub } = require('apollo-server')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const pubsub = new PubSub()

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

 type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

type Book {
  title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
}

type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
}

type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book 
    editAuthor(
      name: String!, 
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded : Book!
}
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (!args.author && !args.genre) return Book.find({}).populate("author")

        if (args.author && !args.genre) {
          author = await Author.findOne({ name: args.author });
          return Book.find()
          .where({ author: author ? author._id : null })
          .populate('author')
      } else if (!args.author && args.genre) {
          return Book.find()
          .where({ genres: { $in: [args.genre] } })
          .populate('author')
      } else {
          author = await Author.findOne({ name: args.author })
          return Book.find()
          .where({
            author: author ? author._id : null,
            genres: { $in: [args.genre] },
          })
          .populate('author')
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(async author => {
          return {
              name: author.name,
              born: author.born,
              id: author.id,
              bookCount: await Book.find({ author: author.id }).countDocuments()
          }
      })
  },
    me: (root, args, context) => {
      return context.currentUser
  },
},
Mutation: {
  addBook: async (root, args, { currentUser }) => {

    if (!currentUser) {
        throw new AuthenticationError("not authenticated")
    }

    let author = await Author.findOne({ name: args.author })
    if (!author) {
      author = await new Author({ name: args.author, born: 1992 })
      await author.save()
    }
    const book = new Book({ ...args, author })
    try {
      await book.save()
    } 
    catch (error) {
      throw new UserInputError(error.message)
    }
    pubsub.publish('BOOK_ADDED', { bookAdded: book })
    return book
  },
  editAuthor: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    let author = await Author.findOne({ name: args.name })
    if (!author) {
          throw new ApolloError("Author not found")
        }
    author.born = args.setBornTo
    await author.save()
    return author
  },
  createUser: (root, args) => {
    const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    return user.save()
        .catch(error => {
            throw new UserInputError(error.message, {invalidArgs: args,})
         })        
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })
    if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return { value: jwt.sign(userForToken, config.JWT_SECRET )}
    },
  },
  Subscription: {
    bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), config.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscription ready at ${subscriptionsUrl}`)
})