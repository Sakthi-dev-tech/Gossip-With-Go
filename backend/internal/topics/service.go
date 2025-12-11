package topics

import (
	"context"
	"fmt"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/jackc/pgx/v5"
)

func NewService(repo *repo.Queries, db *pgx.Conn) Service {
	return &svc{repo: repo, db: db}
}

func (s *svc) ListTopics(ctx context.Context) ([]repo.Topic, error) {
	return s.repo.ListTopics(ctx)
}

func (s *svc) CreateTopic(ctx context.Context, params repo.CreateTopicParams) (repo.Topic, error) {
	// validate the params
	if params.Name == "" {
		return repo.Topic{}, fmt.Errorf("name is required")
	}

	if params.Description == "" {
		return repo.Topic{}, fmt.Errorf("description is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Topic{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	topic, err := qtx.CreateTopic(ctx, params)
	if err != nil {
		return repo.Topic{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Topic{}, err
	}

	return topic, nil
}

func (s *svc) UpdateTopic(ctx context.Context, params repo.UpdateTopicParams) (repo.Topic, error) {
	// validate the params
	if params.Name == "" {
		return repo.Topic{}, fmt.Errorf("name is required")
	}

	if params.Description == "" {
		return repo.Topic{}, fmt.Errorf("description is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Topic{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	topic, err := qtx.UpdateTopic(ctx, params)
	if err != nil {
		return repo.Topic{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Topic{}, err
	}

	return topic, nil
}

func (s *svc) DeleteTopic(ctx context.Context, id int64) (repo.Topic, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Topic{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	topic, err := qtx.DeleteTopic(ctx, id)
	if err != nil {
		return repo.Topic{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Topic{}, err
	}

	return topic, nil
}
