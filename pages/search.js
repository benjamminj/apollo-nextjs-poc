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
        name
        html_url
      }
    }
  }
`

const List = ({ topic }) => {
  const { loading, error, data } = useQuery(REACT_REPOS_QUERY, {
    variables: { topic }
  })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error 😱</div>
  return (
    <pre>
      <code>{JSON.stringify(data, null, 4)}</code>
    </pre>
  )
}

const Search = ({ topic }) => {
  const [input, setInput] = useState(topic)
  const router = useRouter()

  console.log(router)
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
