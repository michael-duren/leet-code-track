package lib

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func ParseIDParam(r *http.Request) (int64, error) {
	idStr := chi.URLParam(r, "id")
	if id, err := strconv.ParseInt(idStr, 10, 64); err != nil {
		return 0, err
	} else {
		return id, nil
	}
}

func ParseIntParam(r *http.Request, param string) (int64, error) {
	idStr := chi.URLParam(r, param)
	if id, err := strconv.ParseInt(idStr, 10, 64); err != nil {
		return 0, err
	} else {
		return id, nil
	}
}
