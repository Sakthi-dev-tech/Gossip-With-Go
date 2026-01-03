package topics

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
	ListTopics(ctx context.Context) ([]repo.Topic, error)
	CreateTopic(ctx context.Context, params repo.CreateTopicParams) (repo.Topic, error)
	UpdateTopic(ctx context.Context, params repo.UpdateTopicParams) (repo.Topic, error)
	DeleteTopic(ctx context.Context, id int64) (repo.Topic, error)
}
