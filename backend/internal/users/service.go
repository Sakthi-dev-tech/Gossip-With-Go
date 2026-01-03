package users

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/db"
)

func NewService(repo *repo.Queries, pool db.Pool) Service {
	return &svc{repo: repo, db: pool}
}

func (s *svc) FetchUserByUsername(ctx context.Context, username string) (repo.User, error) {
	user, err := s.repo.FetchUserByUsername(ctx, username)
	if err != nil {
		return repo.User{}, err
	}
	return user, nil
}
