package posts

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/jackc/pgx/v5"
)

type handler struct {
	service Service
}

type svc struct {
	// database
	repo *repo.Queries
	db   *pgx.Conn
}

type Service interface {
	ListPosts(ctx context.Context, topicId int64) ([]repo.Post, error)
	CreatePost(ctx context.Context, params repo.CreatePostParams) (repo.Post, error)
	UpdatePost(ctx context.Context, params repo.UpdatePostParams) (repo.Post, error)
	DeletePost(ctx context.Context, id int64) (repo.Post, error)
}
