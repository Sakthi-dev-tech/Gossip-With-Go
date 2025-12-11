package topics

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
	ListTopics(ctx context.Context) ([]repo.Topic, error)
	CreateTopic(ctx context.Context, params repo.CreateTopicParams) (repo.Topic, error)
}
