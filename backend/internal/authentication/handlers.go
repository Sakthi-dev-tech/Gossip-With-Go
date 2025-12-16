package authentication

import (
	"fmt"
	"log"
	"net/http"
	"time"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/env"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/json"
	"github.com/golang-jwt/jwt/v5"
)

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

// Function that handles the CreateUser API
func (h *handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var createUserParams repo.CreateUserParams
	if err := json.Read(r, &createUserParams); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	createdUser, err := h.service.CreateUser(r.Context(), createUserParams)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, createdUser)
}

// GenerateUserToken creates a new JWT token for a user
func GenerateUserToken(userID int64, username string, secretKey []byte) (string, error) {
	// Create claims with user information
	claims := &UserClaims{
		Username: username,
		UserID:   userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)), // 7 days validity
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with secret key
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

func (h *handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var param struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.Read(r, &param); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.service.LoginUser(r.Context(), param.Username, param.Password)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate a JWT token for the user
	secretKey := []byte(env.GetString("JWT_ENCRYPTION_KEY", ""))
	token, err := GenerateUserToken(user.ID, user.Username, secretKey)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Returns the JWT token to save in frontend
	response := map[string]string{
		"token": token,
	}

	json.Write(w, http.StatusOK, response)
}
