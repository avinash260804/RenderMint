type SearchResult = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  body?: string;
  type?: string;
};

export default function SearchResults({
  results,
  query,
}: {
  results: SearchResult[];
  query: string;
}) {
  return (
    <section>
      <h1>Search results for {query}</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        results.map((result) => (
          <article key={result.id}>
            <h2>{result.title}</h2>
            {result.type ? <span>{result.type}</span> : null}
            <p>{result.content ?? result.body}</p>
          </article>
        ))
      )}
    </section>
  );
}
