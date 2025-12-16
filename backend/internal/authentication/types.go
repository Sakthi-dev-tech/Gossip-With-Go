package authentication

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/golang-jwt/jwt/v5"
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

type UserClaims struct {
	Username string `json:"username"`
	UserID   int64  `json:"user_id"`
	jwt.RegisteredClaims
}

type Service interface {
	CreateUser(ctx context.Context, params repo.CreateUserParams) (repo.User, error)
	LoginUser(ctx context.Context, username string, password string) (repo.User, error)
}
