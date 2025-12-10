package main

import (
	"log/slog"
	"os"
)

func main() {
	cfg := config{
		addr: ":8080",
		db:   dbConfig{},
	}

	api := application{
		config: cfg,
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger) // for a more structured logging

	if err := api.run(api.mount()); err != nil {
		slog.Error("server has failed", "error", err)
		os.Exit(1)
	}
}
