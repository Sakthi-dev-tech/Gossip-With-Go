package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/authentication"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/comments"
	appctx "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/context"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/env"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/posts"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/topics"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/users"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
)

// ParseUserToken validates and parses an existing JWT token
func ParseUserToken(tokenString string) (*UserClaims, error) {

	// Get secret key from environment
	secretKey := []byte(env.GetString("JWT_ENCRYPTION_KEY", ""))

	// Validate that the secret key is not empty
	if len(secretKey) == 0 {
		return nil, fmt.Errorf("JWT_ENCRYPTION_KEY not found in environment")
	}

	// Parse the token with custom claims struct
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (any, error) {
		// Validate the signing method to ensure token uses HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("token signed with unexpected method: %v (expected HMAC)", token.Header["alg"])
		}

		// Return the signing key - this is used to verify the token signature
		// The jwt library will automatically verify the signature matches this key
		return secretKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// extract and validate the claims
	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}

// Attach JWT authentication middleware to application
func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Retrieve token from cookie
		cookie, err := r.Cookie("access_token")
		if err != nil {
			if err == http.ErrNoCookie {
				http.Error(w, "missing authorisation header", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		tokenString := cookie.Value

		// Parse and validates the token
		claims, err := ParseUserToken(tokenString)
		if err != nil {
			http.Error(w, "invalid authorisation header", http.StatusUnauthorized)
			return
		}

		// Add user info to request context for handlers to use
		ctx := context.WithValue(r.Context(), appctx.UserIDKey, claims.UserID)
		ctx = context.WithValue(ctx, appctx.UsernameKey, claims.Username)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// mount
// attach a mount method for an application instance to mount the routes
func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	// Allow CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
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
	r.Use(middleware.Timeout(time.Minute))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("server is up"))
	})

	authService := authentication.NewService(repo.New(app.db), app.db)
	authHandler := authentication.NewHandler(authService)
	r.Post("/register", authHandler.CreateUser)
	r.Post("/login", authHandler.LoginUser)

	r.Group(func(r chi.Router) {
		r.Use(JWTAuthMiddleware) // JWT authentication middleware

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
		r.Post("/fetchPosts", postsHandler.ListPosts)
		r.Post("/addPost", postsHandler.CreatePost)
		r.Put("/updatePost", postsHandler.UpdatePost)
		r.Delete("/deletePost", postsHandler.DeletePost)

		commentService := comments.NewService(repo.New(app.db), app.db)
		commentsHandler := comments.NewHandler(commentService)
		r.Post("/fetchComments", commentsHandler.ListComments)
		r.Post("/addComment", commentsHandler.CreateComment)
		r.Put("/updateComment", commentsHandler.UpdateComment)
		r.Delete("/deleteComment", commentsHandler.DeleteComment)
	})

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

type UserClaims struct {
	Username string `json:"username"`
	UserID   int64  `json:"user_id"`
	jwt.RegisteredClaims
}
