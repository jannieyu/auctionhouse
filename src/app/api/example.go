package api

import (
	log "github.com/sirupsen/logrus"
	"net/http"
)

/* TODO: Untouched. Clean up or remove. */
func (h Handle) Authenticate(w http.ResponseWriter, r *http.Request) {
	session, _ := h.Store.Get(r, "user-auth")

	// Check if user is authenticated
	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	} else {
		urlParams := r.URL.Query()["data"]
		log.Debug(urlParams)
		SafeEncode(w, urlParams[0])
	}
}
