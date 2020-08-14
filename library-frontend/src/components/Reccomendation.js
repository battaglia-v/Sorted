import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_CURRENT_USER, GET_ALL_BOOKS } from '../queries'


const Reccommendation = ({ show, result }) => {
    const user = useQuery(GET_CURRENT_USER)
    const books = useQuery(GET_ALL_BOOKS)
    const [filteredBooks, setFilteredBooks] = useState(null)
    console.log(filteredBooks)
    
    useEffect(() => {
        if (books.data && user.data) {
            setFilteredBooks(books.data.allBooks.filter(
                b => b.genres.includes(user.data.me.favoriteGenre)))
        }
      }, [books.data, user.data])


    if (!show) {
        return null
    }
    else if (books.data.loading) {
        return "Loading..."
    }

    return (
        <div>
            <h2>Book Reccommendations</h2>

            <h4>Based on: {user.data.me.favoriteGenre}</h4>
            
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {filteredBooks.map(a =>
                            <tr key={a.title}>
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

export default Reccommendation