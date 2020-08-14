import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Reccomendation from './components/Reccomendation'

const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if ( token ) {
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    setPage('login')
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
 
  return (
    <>
     <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token 
           ? (
              <>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={() => setPage('reccomend')}>reccomend</button>
                <button onClick={() => logout()}>logout</button>
              </>
           )
           : (
                <button onClick={() => setPage('login')}>login</button>  
           )
        }
      </div>

      <Authors
        setError={notify}
        token={token}
        show={page === 'authors'}
      />

      <Books
        token={token}
        show={page === 'books'}
      />

      <NewBook
        setError={notify}
        token={token}
        show={page === 'add'}
      />

      <Reccomendation
        setError={notify}
        token={token}
        show={page === 'reccomend'}
      />

      <LoginForm 
        setError={notify}
        token={token}
        setToken={setToken}
        setPage={setPage}
        show={page === 'login'}
      />

    </>
  )
}

export default App