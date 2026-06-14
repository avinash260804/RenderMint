type Post = {
  title: string;
  content?: string;
  body?: string;
  type: string;
  acceptedCommentId?: string | null;
};

type Comment = {
  id: string;
  content?: string;
  body?: string;
};

export default function ThreadPage({
  post,
  comments,
}: {
  post: Post;
  comments: Comment[];
  currentUserId: string | null;
}) {
  return (
    <main>
      <h1>{post.title}</h1>
      <span>{post.type}</span>
      {post.acceptedCommentId ? <strong>Solved</strong> : null}
      <p>{post.content ?? post.body}</p>
      <section>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to reply.</p>
        ) : (
          comments.map((comment) => <article key={comment.id}>{comment.content ?? comment.body}</article>)
        )}
      </section>
    </main>
  );
}
