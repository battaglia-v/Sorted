import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [ books, setBooks ] = useState([])
  const [ genres, setGenres ] = useState([])
  const [ filteredBooks, setFilteredBooks ] = useState(books)
  const result = useQuery(GET_ALL_BOOKS)

  console.log(genres)

  useEffect(() => {
  if (result.data) {
    const bookList = result.data.allBooks
    setBooks(bookList)
    setFilteredBooks(bookList)
    const genres = bookList.map(b => b.genres).flat()
    const uniqueGenres = [...new Set(genres.map(g => g.trim()))]
    setGenres(uniqueGenres)
  }
}, [result.data ])

  if (!props.show) {
    return null
  }

  if (!books) {
    return "Loading..."
  }

   
   
   const filteredByGenre = (clickedGenre) => {
     setFilteredBooks(books.filter(book => book.genres.includes(clickedGenre)))
   }
    
    const allBooks = () => {
      setFilteredBooks(books)
    }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
            <th>
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
            <div>
                <h3>Genres</h3>
                {
                    genres.map(genre => <button key={genre} onClick={() => filteredByGenre(genre)}>{genre}</button>)
                }
                <button onClick={() => allBooks()}>All Genres</button>
            </div>
    </div>
  )
}

export default Books