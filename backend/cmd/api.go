package main

import (
	"log"
	"net/http"
	"time"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/topics"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/users"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5"
)

// mount
// attach a mount method for an application instance to mount the routes
func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID) // for rate limiting (not really impt)
	r.Use(middleware.RealIP)    // for rate limiting too + analytics + tracing
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer) // recover from crashes

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("server is up"))
	})

	userService := users.NewService(repo.New(app.db), app.db)
	usersHandler := users.NewHandler(userService)
	r.Post("/addUser", usersHandler.CreateUser)
	r.Get("/fetchUserByUsername", usersHandler.FetchUserByUsername)

	topicService := topics.NewService(repo.New(app.db), app.db)
	topicsHandler := topics.NewHandler(topicService)
	r.Get("/fetchTopics", topicsHandler.ListTopics)

	r.Post("/addTopic", topicsHandler.CreateTopic)

	return r
}

// run
// attach a run method for an application instance to start the server
func (app *application) run(h http.Handler) error {
	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      h,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	log.Printf("Starting server on %s\n", app.config.addr)

	return srv.ListenAndServe()
}

type application struct {
	config config
	db     *pgx.Conn
}

type config struct {
	addr string // port
	db   dbConfig
}

type dbConfig struct {
	dsn string // domain string
}
