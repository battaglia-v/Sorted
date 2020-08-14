import React, { useState } from 'react'
import { useMutation, useSubscription, useApolloClient  } from '@apollo/client'
import { CREATE_BOOK, GET_ALL_BOOKS, GET_ALL_AUTHORS, BOOK_ADDED } from '../queries'


const NewBook = ({ show, setError }) => {
  const client = useApolloClient()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
    onError: (error) => {
      if (error === 'undefined') return null 
      setError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addBook);
  }
  })

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
        console.log(object, addedBook)
        return set.map(p => p.id).includes(object.id)
    }
    const dataInStore = client.readQuery({ query: GET_ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
        dataInStore.allBooks.concat(addedBook)
        client.writeQuery({
            query: GET_ALL_BOOKS,
            data: dataInStore
        })
    }
}

useSubscription(BOOK_ADDED, {
  onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded
      setError(`${newBook.title} added`)
      updateCacheWith(newBook)
  }
})

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    await createBook({ 
      variables: { 
        title, 
        published, 
        author,
        genres
      }
    })

    setTitle('')
    setPublished(0)
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook