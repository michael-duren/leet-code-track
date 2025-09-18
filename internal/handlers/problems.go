package handlers

import (
	"encoding/json"
	"net/http"

	"leet-code-track/internal/database"
	"leet-code-track/internal/lib"
	"leet-code-track/internal/services"
)

type ProblemHandlers struct {
	problemService *services.ProblemService
}

var problemHandlers *ProblemHandlers

func NewProblemHandlers() *ProblemHandlers {
	if problemHandlers != nil {
		return problemHandlers
	}

	problemHandlers = &ProblemHandlers{
		problemService: services.NewProblemService(),
	}

	return problemHandlers
}

func (p *ProblemHandlers) GetTodaysProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := p.problemService.ListTodaysProblems(r.Context())
	lib.HandleDatabaseQueryResponse(w, problems, err)
}

func (p *ProblemHandlers) GetAllProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := p.problemService.ListProblems(r.Context())
	lib.HandleDatabaseQueryResponse(w, problems, err)
}

func (p *ProblemHandlers) GetProblemByID(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	problem, err := p.problemService.GetProblemByID(r.Context(), id)
	lib.HandleDatabaseQueryResponse(w, problem, err)
}

func (p *ProblemHandlers) GetNextReviewedProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := p.problemService.ListNextReviewedProblems(r.Context())
	lib.HandleDatabaseQueryResponse(w, problems, err)
}

func (p *ProblemHandlers) CreateProblem(w http.ResponseWriter, r *http.Request) {
	var params database.CreateProblemParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	id, err := p.problemService.CreateProblem(r.Context(), params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	lib.RenderJSON(w, http.StatusCreated, map[string]int64{"id": id})
}

func (p *ProblemHandlers) UpdateForFirstReview(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	err = p.problemService.UpdateForFirstReview(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Problem updated for first review"})
}

func (p *ProblemHandlers) UpdateForSecondReview(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	err = p.problemService.UpdateForSecondReview(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Problem updated for second review"})
}

func (p *ProblemHandlers) UpdateForMasterReview(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	err = p.problemService.UpdateForMasterReview(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Problem mastered"})
}

func (p *ProblemHandlers) ResetReviewTimer(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	err = p.problemService.ResetReviewTimer(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Review timer reset"})
}

func (p *ProblemHandlers) DeleteProblem(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	err = p.problemService.DeleteProblem(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Problem deleted"})
}

func (p *ProblemHandlers) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := p.problemService.GetStats(r.Context())
	lib.HandleDatabaseQueryResponse(w, stats, err)
}

func (p *ProblemHandlers) GetProblemsByTopic(w http.ResponseWriter, r *http.Request) {
	problems, err := p.problemService.GetProblemByTopic(r.Context())
	lib.HandleDatabaseQueryResponse(w, problems, err)
}

func (p *ProblemHandlers) UpdateProblemNotes(w http.ResponseWriter, r *http.Request) {
	id, err := lib.ParseIDParam(r)
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	var params struct {
		Notes *string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	updateParams := database.UpdateProblemNotesParams{
		ID:    id,
		Notes: params.Notes,
	}

	err = p.problemService.UpdateProbleNotes(r.Context(), updateParams)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Notes updated"})
}

func (p *ProblemHandlers) SearchProblems(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	searchQuery := "%" + query + "%"
	params := database.SearchProblemsParams{
		Title:   searchQuery,
		Pattern: &searchQuery,
	}

	problems, err := p.problemService.SearchProblems(r.Context(), params)
	lib.HandleDatabaseQueryResponse(w, problems, err)
}
