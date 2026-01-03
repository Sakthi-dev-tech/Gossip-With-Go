package users

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
	FetchUserByUsername(ctx context.Context, params string) (repo.User, error)
}
