package posts

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/db"
)

type handler struct {
	service Service
}

type svc struct {
	// database
	repo *repo.Queries
	db   db.Pool
}

type Service interface {
	ListPosts(ctx context.Context, topicId int64) ([]repo.Post, error)
	CreatePost(ctx context.Context, params repo.CreatePostParams) (repo.Post, error)
	UpdatePost(ctx context.Context, params repo.UpdatePostParams) (repo.Post, error)
	DeletePost(ctx context.Context, id int64) (repo.Post, error)
}
