import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'
import Select from 'react-select'



const Authors = (props) => {
  const [ authors, setAuthors ] = useState([])
  const [ name, setName ] = useState('')
  const [ born, setBorn] = useState(null)
  const [ authorNames, setAuthorNames ] = useState([])

  const result = useQuery(ALL_AUTHORS)

  useEffect(() => {
  if (result.data) {
    const authorList = result.data.allAuthors
    setAuthors(authorList)
  }
}, [result.data])

const [ changeBirthYear ] = useMutation(EDIT_BIRTHYEAR)

const updateBirthYear = (event) => {
  event.preventDefault()

  changeBirthYear({ variables: { name, born } })

  setName('')
  setBorn('')
}

const options = authors.map(a => 
  ({ value: a.name.toLowerCase(), label: a.name })
) 

if (!props.show) {
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
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
          name
          <Select
          value={name}
            onChange={({ target }) => setName(target.value)}
            options={options}
          /> 
           born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
          <button onClick={updateBirthYear} type="submit">update author</button>
    </div>
  )
}

export default Authors
