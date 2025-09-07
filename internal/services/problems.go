// Package services
package services

import (
	"context"
	"database/sql"
	"leet-code-track/internal/database"
)

type ProblemService struct {
	db *sql.DB
	q  *database.Queries
}

var problemService *ProblemService

func NewProblemService() *ProblemService {
	if problemService != nil {
		return problemService
	}

	db := database.NewDatabase()
	instance := &ProblemService{
		q: db.Queries(),
	}

	problemService = instance
	return instance
}

func (p ProblemService) GetTodaysProblems(ctx context.Context) ([]database.ListTodaysProblemsRow, error) {
	return p.q.ListTodaysProblems(ctx)
}
