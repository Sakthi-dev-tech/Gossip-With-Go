package posts

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

// Function that handles the ListPosts API
func (h *handler) ListPosts(w http.ResponseWriter, r *http.Request) {
	var data struct {
		TopicId int64 `json:"topic_id"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Call this service -> ListPosts
	topics, err := h.service.ListPosts(r.Context(), data.TopicId)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return JSON in an HTTP response
	json.Write(w, http.StatusOK, topics)
}

// Function that handles the CreatePost API
func (h *handler) CreatePost(w http.ResponseWriter, r *http.Request) {

	// get the topic params from the request body
	var createPostParams repo.CreatePostParams
	if err := json.Read(r, &createPostParams); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	createdPost, err := h.service.CreatePost(r.Context(), createPostParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, createdPost)
}
