package comments

import (
	"context"
	"fmt"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/jackc/pgx/v5"
)

func NewService(repo *repo.Queries, db *pgx.Conn) Service {
	return &svc{repo: repo, db: db}
}

func (s *svc) ListComments(ctx context.Context, postId int64) ([]repo.Comment, error) {
	return s.repo.ListComments(ctx, postId)
}

func (s *svc) CreateComment(ctx context.Context, params repo.CreateCommentParams) (repo.Comment, error) {
	// validate the params
	if params.Content == "" {
		return repo.Comment{}, fmt.Errorf("content is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Comment{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	comment, err := qtx.CreateComment(ctx, params)
	if err != nil {
		return repo.Comment{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Comment{}, err
	}

	return comment, nil
}
