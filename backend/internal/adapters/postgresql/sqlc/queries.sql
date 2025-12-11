-- name: ListTopics :many
SELECT * FROM topics;

-- name: ListPosts :many
SELECT * FROM posts WHERE topic_id = $1;

-- name: ListComments :many
SELECT * FROM comments WHERE post_id = $1;

-- name: FetchUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: CreateTopic :one
INSERT INTO topics (name, description, user_id) VALUES ($1, $2, $3) RETURNING *;

-- name: CreatePost :one
INSERT INTO posts (title, content, topic_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: CreateComment :one
INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *;

-- name: CreateUser :one
INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;

-- name: UpdateTopic :one
UPDATE topics SET name = $2, description = $3 WHERE id = $1 RETURNING *;

-- name: UpdatePost :one
UPDATE posts SET title = $2, content = $3 WHERE id = $1 RETURNING *;

-- name: UpdateComment :one
UPDATE comments SET content = $2 WHERE id = $1 RETURNING *;

-- name: DeleteTopic :one
DELETE FROM topics WHERE id = $1 RETURNING *;

-- name: DeletePost :one
DELETE FROM posts WHERE id = $1 RETURNING *;

-- name: DeleteComment :one
DELETE FROM comments WHERE id = $1 RETURNING *;