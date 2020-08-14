import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'



const Authors = ({ show, setError }) => {
  const [ author, setAuthor ] = useState('')
  const [ authors, setAuthors ] = useState('')
  const [ born, setBorn] = useState('')

  const getAllAuthors = useQuery(GET_ALL_AUTHORS)

  useEffect(() => {
    if (getAllAuthors.data) {
      const authors = getAllAuthors.data.allAuthors
      setAuthors(authors)
    }
  }, [getAllAuthors.data])

  const [ editBirthYear ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })
  
  const updateAuthor = async (e) => {
    e.preventDefault()
    console.log("updating author")
    await editBirthYear({
      variables: {
        name: author,
        setBornTo: born,
      }
    })
    setAuthor('')
    setBorn('')
  }

if (!show) {
  return null
}

if (!authors) {
  return "Loading..."
}

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birth year</h2>
          {/* <Select
            options={options}
            onChange={({ name }) => setName(name)}
          /> 
           born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
          <button onClick={updateBirthYear} type="submit">update author</button>
    </div> */}
    <form onSubmit={updateAuthor}>
      <select onChange={({ target }) => setAuthor(target.value)}>
      {authors.map(a =>
        <option
          key={a.id}
          value={a.name}>
          {a.name}
        </option>
      )}
      </select>
      <div>
        born
        <input
          type="number" name="born" onChange={({ target }) => setBorn(parseInt(target.value))} value={born}
        />
      </div>
      <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
