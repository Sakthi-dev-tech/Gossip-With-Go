package json

import (
	"encoding/json"
	"net/http"
)

// an agnostic function to send a JSON response
func Write(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
