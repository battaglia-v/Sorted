import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { 
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache
  } from '@apollo/client' 
 
const cache = new InMemoryCache()

const client = new ApolloClient({
    cache,
    link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    onError: ({ networkError, graphQLErrors }) => {
      console.log('graphQLErrors', graphQLErrors)
      console.log('networkError', networkError)
    }
  }),
})



ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'))