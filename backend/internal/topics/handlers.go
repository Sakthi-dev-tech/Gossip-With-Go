package topics

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

func (h *handler) ListTopics(w http.ResponseWriter, r *http.Request) {
	// Call this service -> ListTopics
	topics, err := h.service.ListTopics(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return JSON in an HTTP respon

	json.Write(w, http.StatusOK, topics)
}

func (h *handler) CreateTopic(w http.ResponseWriter, r *http.Request) {
	var createTopicsParams repo.CreateTopicParams
	if err := json.Read(r, &createTopicsParams); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	createdTopic, err := h.service.CreateTopic(r.Context(), createTopicsParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, createdTopic)
}
