package posts

import (
	"log"
	"net/http"

	repo "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/adapters/postgresql/sqlc"
	appctx "github.com/Sakthi-dev-tech/Gossip-With-Go/internal/context"
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

	// Get user ID from context
	userID, ok := r.Context().Value(appctx.UserIDKey).(int64)
	if !ok {
		log.Println("userID not found in context")
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	createPostParams.UserID = userID

	// Get username from context
	username, ok := r.Context().Value(appctx.UsernameKey).(string)
	if !ok {
		log.Println("username not found in context")
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	createPostParams.Username = username

	createdPost, err := h.service.CreatePost(r.Context(), createPostParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, createdPost)
}

// Function that handles the UpdatePost API
func (h *handler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	// get the post params from the request body
	var updatePostParams repo.UpdatePostParams
	if err := json.Read(r, &updatePostParams); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updatedPost, err := h.service.UpdatePost(r.Context(), updatePostParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, updatedPost)
}

// Function that handles the DeletePost API
func (h *handler) DeletePost(w http.ResponseWriter, r *http.Request) {
	var data struct {
		ID int64 `json:"id"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	deletedPost, err := h.service.DeletePost(r.Context(), data.ID)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, deletedPost)
}
