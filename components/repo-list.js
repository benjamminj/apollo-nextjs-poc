const RepoList = ({ repos }) => {
  return (
    <ul>
      {repos.map(repo => (
        <li key={repo.id}>
          <a href={repo.html_url}>{repo.name}</a>
        </li>
      ))}

      <style jsx>
        {`
          font-family: sans-serif;
          list-style-type: none;
          padding-left: 0;
        `}
      </style>
    </ul>
  )
}

export default RepoList
