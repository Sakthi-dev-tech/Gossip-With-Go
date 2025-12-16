package comments

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

// Function that handles the ListComments API
func (h *handler) ListComments(w http.ResponseWriter, r *http.Request) {
	var data struct {
		PostId int64 `json:"post_id"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Call this service -> ListComments
	comments, err := h.service.ListComments(r.Context(), data.PostId)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return JSON in an HTTP response
	json.Write(w, http.StatusOK, comments)
}

// Function that handles the CreateComment API
func (h *handler) CreateComment(w http.ResponseWriter, r *http.Request) {

	// get the comment params from the request body
	var createCommentParams repo.CreateCommentParams
	if err := json.Read(r, &createCommentParams); err != nil {
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
	createCommentParams.UserID = userID

	createdComment, err := h.service.CreateComment(r.Context(), createCommentParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, createdComment)
}

// Function that handles the UpdateComment API
func (h *handler) UpdateComment(w http.ResponseWriter, r *http.Request) {
	// get the comment params from the request body
	var updateCommentParams repo.UpdateCommentParams
	if err := json.Read(r, &updateCommentParams); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updatedComment, err := h.service.UpdateComment(r.Context(), updateCommentParams)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, updatedComment)
}

// Function that handles the DeleteComment API
func (h *handler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	var data struct {
		ID int64 `json:"id"`
	}
	if err := json.Read(r, &data); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	deletedComment, err := h.service.DeleteComment(r.Context(), data.ID)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, deletedComment)
}
