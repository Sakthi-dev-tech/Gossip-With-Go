package users

import (
	"context"
	"fmt"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/jackc/pgx/v5"
)

func NewService(repo *repo.Queries, db *pgx.Conn) Service {
	return &svc{repo: repo, db: db}
}

func (s *svc) CreateUser(ctx context.Context, params repo.CreateUserParams) (repo.User, error) {
	// validate the params
	if params.Username == "" {
		return repo.User{}, fmt.Errorf("username is required")
	}

	if params.Password == "" {
		return repo.User{}, fmt.Errorf("password is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.User{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	user, err := qtx.CreateUser(ctx, params)
	if err != nil {
		return repo.User{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.User{}, err
	}

	return user, nil
}

func (s *svc) FetchUserByUsername(ctx context.Context, username string) (repo.User, error) {
	user, err := s.repo.FetchUserByUsername(ctx, username)
	if err != nil {
		return repo.User{}, err
	}
	return user, nil
}

func (s *svc) FetchUserById(ctx context.Context, id int64) (repo.User, error) {
	user, err := s.repo.FetchUserById(ctx, id)
	if err != nil {
		return repo.User{}, err
	}
	return user, nil
}
