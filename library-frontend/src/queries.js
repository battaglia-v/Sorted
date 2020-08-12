import { gql } from 'apollo-boost'


export const GET_ALL_AUTHORS = gql`
query {
  allAuthors {
    id
    name
    born
    bookCount
  }
}
`

export const GET_ALL_BOOKS = gql`
query getAllBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    author {
      name
      born
    }
    published
    id
  }
}
`

export const CREATE_BOOK = gql` 
mutation createBook(
  $title: String!
  $author: String!
  $published: Int!
  $genres: [String!]!
  ){
  addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
  ) {
    title
    author 
    published
    genres
    id
  }
}
`

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`


export const FIND_AUTHOR = gql` 
  query findAuthorByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
    }
  }
`
