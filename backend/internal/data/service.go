package data

import (
	"context"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
)

type Service interface {
	ListTopics(ctx context.Context) ([]repo.Topic, error)
}

type svc struct {
	// database
	repo repo.Querier
}

func NewService(repo repo.Querier) Service {
	return &svc{repo: repo}
}

func (s *svc) ListTopics(ctx context.Context) ([]repo.Topic, error) {
	return s.repo.ListTopics(ctx)
}
