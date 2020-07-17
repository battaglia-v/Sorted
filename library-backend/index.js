const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]


/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`

type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
}

type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
}

type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
}

type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book 
    editAuthor(name: String!, setBornTo: Int!): Author
}

`

const resolvers = {
  Query: {
      authorCount: () => authors.length,

      bookCount: () => books.length,

      allBooks: (root, args) => {

            if (!args.genres && !args.author) return books 
            
            const byAuthor = (book) => book.author === args.author

            const byGenre = (book) => book.genres.includes(args.genre)

            const byGenreAndAuthor = (book) => byAuthor(book) && byGenre(book)

            if (args.genre && !args.author) {
            return books.filter(byGenre)

            } else if (!args.genre && args.author) {
            return books.filter(byAuthor)

            } else {
                return books.filter(byGenreAndAuthor)
            }

      },
      allAuthors: () => authors
      },

      Author: {
        bookCount: (root) =>
          books.reduce(
            (count, book) => (book.author === root.name ? count + 1 : count),
            0
          ),
      },
      
      Mutation: {
          addBook: (root, args) => {
              const book = {...args, id: uuid() }
              const author = {name: args.author, born: null, id: uuid()}
                const foundAuthor = authors.find(a => a.name === args.author) 
                    foundAuthor
                    ? null 
                    : authors = authors.concat(author)

                    books = books.concat(book)
                    return book 
          },
          editAuthor: (root, args) => {
            const author = authors.find(a => a.name === args.name)
            if (!author) {
                return null
            }

            const updatedAuthor = {...author, born: args.setBornTo }
            authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
            return updatedAuthor
          }
      }
    }


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})