package comments

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
	ListComments(ctx context.Context, postId int64) ([]repo.Comment, error)
	CreateComment(ctx context.Context, params repo.CreateCommentParams) (repo.Comment, error)
	UpdateComment(ctx context.Context, params repo.UpdateCommentParams) (repo.Comment, error)
	DeleteComment(ctx context.Context, id int64) (repo.Comment, error)
}
