package main

import (
	"log"
	"net/http"
	"time"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/authentication"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/comments"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/posts"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/topics"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/users"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5"
)

// mount
// attach a mount method for an application instance to mount the routes
func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	// Allow CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

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

	authService := authentication.NewService(repo.New(app.db), app.db)
	authHandler := authentication.NewHandler(authService)
	r.Post("/register", authHandler.CreateUser)
	r.Post("/login", authHandler.LoginUser)

	userService := users.NewService(repo.New(app.db), app.db)
	usersHandler := users.NewHandler(userService)
	r.Get("/fetchUserByUsername", usersHandler.FetchUserByUsername)

	topicService := topics.NewService(repo.New(app.db), app.db)
	topicsHandler := topics.NewHandler(topicService)
	r.Get("/fetchTopics", topicsHandler.ListTopics)
	r.Post("/addTopic", topicsHandler.CreateTopic)
	r.Put("/updateTopic", topicsHandler.UpdateTopic)
	r.Delete("/deleteTopic", topicsHandler.DeleteTopic)

	postService := posts.NewService(repo.New(app.db), app.db)
	postsHandler := posts.NewHandler(postService)
	r.Get("/fetchPosts", postsHandler.ListPosts)
	r.Post("/addPost", postsHandler.CreatePost)
	r.Put("/updatePost", postsHandler.UpdatePost)
	r.Delete("/deletePost", postsHandler.DeletePost)

	commentService := comments.NewService(repo.New(app.db), app.db)
	commentsHandler := comments.NewHandler(commentService)
	r.Get("/fetchComments", commentsHandler.ListComments)
	r.Post("/addComment", commentsHandler.CreateComment)
	r.Put("/updateComment", commentsHandler.UpdateComment)
	r.Delete("/deleteComment", commentsHandler.DeleteComment)

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
