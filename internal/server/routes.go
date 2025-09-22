package server

import (
	"embed"
	"encoding/json"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"path/filepath"

	"leet-code-track/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

var h *handlers.Handlers

func init() {
	h = handlers.NewHandlers()
	mime.AddExtensionType(".css", "text/css")
	mime.AddExtensionType(".js", "application/javascript")
	mime.AddExtensionType(".json", "application/json")
}

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {
		r.Get("/problems", h.ProblemHandlers.GetAllProblems)
		r.Get("/problems/today", h.ProblemHandlers.GetTodaysProblems)
		r.Get("/problems/reviews", h.ProblemHandlers.GetNextReviewedProblems)
		r.Get("/problems/stats", h.ProblemHandlers.GetStats)
		r.Get("/problems/topics", h.ProblemHandlers.GetProblemsByTopic)
		r.Get("/problems/search", h.ProblemHandlers.SearchProblems)
		r.Get("/problems/{id}", h.ProblemHandlers.GetProblemByID)
		r.Post("/problems", h.ProblemHandlers.CreateProblem)
		r.Put("/problems/{id}/first-review", h.ProblemHandlers.UpdateForFirstReview)
		r.Put("/problems/{id}/second-review", h.ProblemHandlers.UpdateForSecondReview)
		r.Put("/problems/{id}/master-review", h.ProblemHandlers.UpdateForMasterReview)
		r.Put("/problems/{id}/reset-timer", h.ProblemHandlers.ResetReviewTimer)
		r.Put("/problems/{id}/notes", h.ProblemHandlers.UpdateProblemNotes)
		r.Delete("/problems/{id}", h.ProblemHandlers.DeleteProblem)
	})
	r.Get("/health", s.healthHandler)

	r.Handle("/*", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set MIME type before serving
		ext := filepath.Ext(r.URL.Path)
		switch ext {
		case ".css":
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
		case ".js":
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		case ".html":
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
		}

		http.FileServer(BuildHTTPFS()).ServeHTTP(w, r)
	}))

	return r
}

//go:embed dist/*
//go:embed dist/assets/*
var BuildFs embed.FS

func BuildHTTPFS() http.FileSystem {
	build, err := fs.Sub(BuildFs, "dist")
	if err != nil {
		log.Fatal(err)
	}
	return http.FS(build)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}
