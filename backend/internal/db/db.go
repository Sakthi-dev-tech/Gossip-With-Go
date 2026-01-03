package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// Pool is an interface that both *pgx.Conn and *pgxpool.Pool implement.
// This allows services to work with either a single connection or a connection pool.
type Pool interface {
	Begin(ctx context.Context) (pgx.Tx, error)
}
