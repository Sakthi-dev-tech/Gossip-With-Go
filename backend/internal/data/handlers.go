package data

import (
	"log"
	"net/http"

	"github.com/Sakthi-dev-tech/Gossip-With-Go/internal/json"
)

type handler struct {
	service Service
}

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
