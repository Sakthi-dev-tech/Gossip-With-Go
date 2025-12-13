package authentication

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

type authenticatedResponse struct {
	authorised bool
	error      error
}

type Service interface {
	CreateUser(ctx context.Context, params repo.CreateUserParams) (repo.User, error)
	LoginUser(ctx context.Context, username string, password string) (bool, error)
}
