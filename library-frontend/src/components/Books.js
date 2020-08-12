import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [ books, setBooks ] = useState([])
  const result = useQuery(GET_ALL_BOOKS)

  useEffect(() => {
  if (result.data) {
    const bookList = result.data.allBooks
    setBooks(bookList)
  }
}, [result.data])
console.log(result)

if (!props.show) {
  return null
}

if (!books) {
  return "Loading..."
}

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books