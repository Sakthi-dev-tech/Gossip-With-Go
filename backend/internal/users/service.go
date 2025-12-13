package users

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/jackc/pgx/v5"
)

func NewService(repo *repo.Queries, db *pgx.Conn) Service {
	return &svc{repo: repo, db: db}
}

func (s *svc) FetchUserByUsername(ctx context.Context, username string) (repo.User, error) {
	user, err := s.repo.FetchUserByUsername(ctx, username)
	if err != nil {
		return repo.User{}, err
	}
	return user, nil
}
