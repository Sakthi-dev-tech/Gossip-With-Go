package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/env"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

// TODO: Make sure the sslmode is proper before deploying
func main() {
	ctx := context.Background()

	// load .env file
	if err := godotenv.Load(); err != nil {
		slog.Warn("No .env file found")
	}

	cfg := config{
		addr: ":" + env.GetString("PORT", "8080"),
		db: dbConfig{
			dsn: env.GetString("DATABASE_URL", "host=localhost user=postgres password=Sakthi2004 dbname=Gossip-With-Go sslmode=disable"),
		},
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger) // for a more structured logging

	// Database
	conn, err := pgx.Connect(ctx, cfg.db.dsn)
	if err != nil {
		panic(err)
	}
	defer conn.Close(ctx)

	logger.Info("connected to database", "dsn", cfg.db.dsn)

	api := application{
		config: cfg,
		db:     conn,
	}

	if err := api.run(api.mount()); err != nil {
		slog.Error("server has failed", "error", err)
		os.Exit(1)
	}
}
