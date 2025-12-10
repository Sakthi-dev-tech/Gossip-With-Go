package data

import "context"

type Service interface {
	ListTopics(ctx context.Context) error
}

type svc struct {
	// database
}

func NewService() Service {
	return &svc{}
}

func (s *svc) ListTopics(ctx context.Context) error {
	return nil
}
