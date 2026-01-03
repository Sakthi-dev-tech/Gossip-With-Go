package authentication

import (
	"context"
	"errors"
	"fmt"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/db"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

func NewService(repo *repo.Queries, pool db.Pool) Service {
	return &svc{repo: repo, db: pool}
}

func (s *svc) CreateUser(ctx context.Context, params repo.CreateUserParams) (repo.User, error) {
	// validate the params
	if params.Username == "" {
		return repo.User{}, fmt.Errorf("username is required")
	}

	if params.Password == "" {
		return repo.User{}, fmt.Errorf("password is required")
	}

	password, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return repo.User{}, err
	}

	params.Password = string(password)

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.User{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	user, err := qtx.CreateUser(ctx, params)
	if err != nil {
		// return a more user friendly error message
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case pgerrcode.UniqueViolation:
				return repo.User{}, fmt.Errorf("username already exists")
			default:
				return repo.User{}, fmt.Errorf("database error: %s", pgErr.Hint)
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.User{}, err
	}

	return user, nil
}

func (s *svc) LoginUser(ctx context.Context, username string, password string) (repo.User, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.User{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	user, err := qtx.FetchUserByUsername(ctx, username)
	if err != nil {
		// Check if user doesn't exist
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case pgerrcode.NoData:
				return repo.User{}, fmt.Errorf("user not found")
			default:
				return repo.User{}, fmt.Errorf("database error: %s", pgErr.Hint)
			}
		}
		return repo.User{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.User{}, err
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return repo.User{}, fmt.Errorf("invalid password")
	}

	return user, nil
}
