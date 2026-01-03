-- +goose Up
-- +goose StatementBegin

-- Add indexes for frequently queried columns to improve query performance
-- This will significantly reduce database CPU usage and costs on Railway

-- Index for fetching posts by topic (used in ListPosts query)
CREATE INDEX IF NOT EXISTS idx_posts_topic_id ON posts(topic_id);

-- Index for fetching comments by post (used in ListComments query)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Index for faster ordering by creation time (frequently needed for displaying recent content)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at DESC);

-- Index for user_id lookups (used in foreign key relationships and ownership checks)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_posts_topic_id;
DROP INDEX IF EXISTS idx_comments_post_id;
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_comments_created_at;
DROP INDEX IF EXISTS idx_topics_created_at;
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_topics_user_id;
-- +goose StatementEnd
