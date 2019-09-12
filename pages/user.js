import { withApollo } from "../lib/apollo"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import InputForm from "../components/input-form"
import { useRouter } from "next/dist/client/router"
import RepoList from "../components/repo-list"

const USER_REPOS_PATH = username => `/users/${username}/repos`
const USER_REPOS_QUERY = gql`
  query userRepos($username: String!, $page: Int!) {
    userRepos(username: $username, page: $page)
      @rest(
        type: "Repo[]"
        path: "/users/{args.username}/repos?page={args.page}"
      ) {
      name
      id
      html_url
    }
  }
`

const List = ({ user }) => {
  const { data, loading, error, fetchMore } = useQuery(USER_REPOS_QUERY, {
    variables: {
      username: user,
      page: 1
    }
  })

  if (loading) return <>Loading...</>
  if (error) return <>Error 😱</>

  // TODO: need to extract the pagination data from the res. headers,
  // since that's how GH API does pagination. For now this is a temp
  // solution, kinda like if the API returned a "totalPages" key.
  // Right now I've just hard-coded it at 3 pages (that's how many repo pages
  //  I have on my acct)
  //
  // There is a way to do pagination from the headers, looks like this will be
  // helpful
  // https://www.apollographql.com/docs/link/links/rest/#link-context
  const LIMIT = 3
  const nextPage = data.userRepos.length / 30 + 1

  return (
    <>
      <RepoList repos={data.userRepos} />

      <button
        disabled={nextPage > LIMIT}
        type="button"
        onClick={() => {
          fetchMore({
            variables: {
              page: nextPage
            },
            updateQuery: (prevResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prevResult

              return {
                ...prevResult,
                userRepos: [
                  ...prevResult.userRepos,
                  ...fetchMoreResult.userRepos
                ]
              }
            }
          })
        }}
      >
        more!
      </button>
    </>
  )
}

const UserRepos = ({ user }) => {
  const router = useRouter()
  return (
    <div>
      <InputForm
        id="usernameInput"
        label="username: "
        initialValue={user}
        onChangeValue={value => {
          router.replace({
            pathname: router.pathname,
            query: {
              user: value
            }
          })
        }}
      />

      {user && <List user={user} />}
    </div>
  )
}
UserRepos.getInitialProps = ({ query }) => {
  return {
    user: query.user
  }
}

export default withApollo(UserRepos)
