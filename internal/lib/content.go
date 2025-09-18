// Package lib has util fns
package lib

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/charmbracelet/log"
)

func RenderJSON(w http.ResponseWriter, statusCode int, v any) {
	buf := &bytes.Buffer{}
	enc := json.NewEncoder(buf)
	enc.SetEscapeHTML(true)
	if err := enc.Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	_, _ = w.Write(buf.Bytes())
}

var NoRowsErrorTxt = "no rows in result set"

func HandleDatabaseError(w http.ResponseWriter, err error) {
	if err.Error() == NoRowsErrorTxt {
		log.Info("No results returned")
		RenderJSON(w, http.StatusNoContent, nil)
		return
	}

	log.Error("Error: ", "err", err)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func HandleDatabaseQueryResponse[TResponse any](w http.ResponseWriter, resp TResponse, err error) {
	if err != nil {
		HandleDatabaseError(w, err)
		return
	}
	RenderJSON(w, 200, resp)
}
