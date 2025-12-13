package authentication

import (
	"log"
	"net/http"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/json"
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

	authenticated, err := h.service.LoginUser(r.Context(), param.Username, param.Password)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, authenticatedResponse{
		authorised: authenticated,
		error:      err,
	})
}
