BEGIN;

SELECT plan(8);

SELECT has_table('public', 'posts', 'posts table should exist');
SELECT has_column('public', 'posts', 'id', 'posts.id column exists');
SELECT has_column('public', 'posts', 'title', 'posts.title column exists');
SELECT has_column('public', 'posts', 'slug', 'posts.slug column exists');
SELECT has_column('public', 'posts', 'deleted_at', 'posts.deleted_at column exists');

SELECT has_table('public', 'votes', 'votes table should exist');
SELECT has_index('public', 'votes', 'uq_votes_author_post', 'votes unique index on author_id and post_id exists');
SELECT has_index('public', 'votes', 'uq_votes_author_comment', 'votes unique index on author_id and comment_id exists');

SELECT * FROM finish();

ROLLBACK;
