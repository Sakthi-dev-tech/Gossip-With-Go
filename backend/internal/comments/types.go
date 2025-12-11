package comments

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
	ListComments(ctx context.Context, postId int64) ([]repo.Comment, error)
	CreateComment(ctx context.Context, params repo.CreateCommentParams) (repo.Comment, error)
}
