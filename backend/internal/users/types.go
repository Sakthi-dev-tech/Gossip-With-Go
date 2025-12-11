package users

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
	CreateUser(ctx context.Context, params repo.CreateUserParams) (repo.User, error)
	FetchUserByUsername(ctx context.Context, params string) (repo.User, error)
	FetchUserById(ctx context.Context, params int64) (repo.User, error)
}
