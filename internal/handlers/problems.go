package handlers

import (
	"leet-code-track/internal/lib"
	"leet-code-track/internal/services"
	"net/http"
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
	problems, err := p.problemService.GetTodaysProblems(r.Context())
	if err != nil {
		lib.HandleDatabaseError(w, err)
		return
	}
	lib.RenderJSON(w, 200, problems)
}
