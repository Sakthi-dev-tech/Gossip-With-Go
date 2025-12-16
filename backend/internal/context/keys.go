package context

// contextKey is a custom type for context keys to avoid collisions
type contextKey string

const (
	UserIDKey   contextKey = "userID"
	UsernameKey contextKey = "username"
)
