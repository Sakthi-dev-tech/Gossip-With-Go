package posts

import (
	"context"
	"fmt"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/db"
)

func NewService(repo *repo.Queries, pool db.Pool) Service {
	return &svc{repo: repo, db: pool}
}

func (s *svc) ListPosts(ctx context.Context, topicId int64) ([]repo.Post, error) {
	return s.repo.ListPosts(ctx, topicId)
}

func (s *svc) CreatePost(ctx context.Context, params repo.CreatePostParams) (repo.Post, error) {
	// validate the params
	if params.Title == "" {
		return repo.Post{}, fmt.Errorf("title is required")
	}

	if params.Content == "" {
		return repo.Post{}, fmt.Errorf("content is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Post{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	post, err := qtx.CreatePost(ctx, params)
	if err != nil {
		return repo.Post{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Post{}, err
	}

	return post, nil
}

func (s *svc) UpdatePost(ctx context.Context, params repo.UpdatePostParams) (repo.Post, error) {
	// validate the params
	if params.Title == "" {
		return repo.Post{}, fmt.Errorf("title is required")
	}

	if params.Content == "" {
		return repo.Post{}, fmt.Errorf("content is required")
	}

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Post{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	post, err := qtx.UpdatePost(ctx, params)
	if err != nil {
		return repo.Post{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Post{}, err
	}

	return post, nil
}

func (s *svc) DeletePost(ctx context.Context, id int64) (repo.Post, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return repo.Post{}, err
	}
	defer tx.Rollback(ctx)
	qtx := s.repo.WithTx(tx)

	post, err := qtx.DeletePost(ctx, id)
	if err != nil {
		return repo.Post{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return repo.Post{}, err
	}

	return post, nil
}
