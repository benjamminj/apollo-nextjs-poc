import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import { withApollo } from "../lib/apollo"
import { useState } from "react"
import { useRouter } from "next/dist/client/router"

const SEARCH_REPOS_URL = "/search/repositories"

const REACT_REPOS_QUERY = gql`
  query repoList($topic: String!) {
    repos(topic: $topic)
      @rest(type: "RepoList", path: "${SEARCH_REPOS_URL}?q={args.topic}") {
      items @type(name: "Repo") {
        id
        name
        html_url
      }
    }
  }
`

const List = ({ topic }) => {
  const { loading, error, data, fetchMore } = useQuery(REACT_REPOS_QUERY, {
    variables: { topic }
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error 😱</div>

  return (
    <>
      <ul>
        {data.repos.items.map(item => (
          <li key={item.id}>
            <a href={item.html_url}>{item.name}</a>
          </li>
        ))}

        <style jsx>
          {`
            ul {
              list-style-type: none;
              padding-left: 0;
            }
          `}
        </style>
      </ul>
    </>
  )
}

const Search = ({ topic }) => {
  const [input, setInput] = useState(topic)
  const router = useRouter()

  return (
    <div>
      <form
        onSubmit={ev => {
          ev.preventDefault()

          router.replace({
            pathname: router.pathname,
            query: {
              topic: input
            }
          })
        }}
      >
        <label htmlFor="searchInput">topic</label>
        <input value={input} onChange={ev => setInput(ev.target.value)} />
        <button type="submit">search!</button>
      </form>

      {topic && <List topic={topic} />}
    </div>
  )
}

Search.getInitialProps = ({ query }) => {
  console.log("QUERY", query)
  const { topic } = query
  return {
    topic
  }
}

export default withApollo(Search)
