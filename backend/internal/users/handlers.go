package users

import (
	"log"
	"net/http"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/json"
)

// NewHandler
// function to create a handler instance with the service layer as dependency
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

func (h *handler) FetchUserByUsername(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Username string `json:"username"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.service.FetchUserByUsername(r.Context(), data.Username)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, user)
}

func (h *handler) FetchUserById(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Id int64 `json:"id"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.service.FetchUserById(r.Context(), data.Id)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, user)
}
