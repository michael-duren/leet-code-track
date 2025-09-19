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

func (p *ProblemService) ListTodaysProblems(ctx context.Context) ([]database.ListTodaysProblemsRow, error) {
	return p.q.ListTodaysProblems(ctx)
}

func (p *ProblemService) ListProblems(ctx context.Context) ([]database.ListProblemsRow, error) {
	return p.q.ListProblems(ctx)
}

func (p *ProblemService) GetProblemByID(ctx context.Context, id int64) (database.GetProblemByIdRow, error) {
	return p.q.GetProblemById(ctx, id)
}

func (p *ProblemService) ListNextReviewedProblems(ctx context.Context) ([]database.ListNextReviewedProblemsRow, error) {
	return p.q.ListNextReviewedProblems(ctx)
}

func (p *ProblemService) CreateProblem(ctx context.Context, arg database.CreateProblemParams) (int64, error) {
	return p.q.CreateProblem(ctx, arg)
}

func (p *ProblemService) UpdateForFirstReview(ctx context.Context, problemID int64) error {
	return p.q.UpdateForFirstReview(ctx, problemID)
}

func (p *ProblemService) UpdateForSecondReview(ctx context.Context, problemID int64) error {
	return p.q.UpdateForSecondReview(ctx, problemID)
}

func (p *ProblemService) UpdateForMasterReview(ctx context.Context, problemID int64) error {
	return p.q.UpdateForMasterReview(ctx, problemID)
}

func (p *ProblemService) ResetReviewTimer(ctx context.Context, problemID int64) error {
	return p.q.ResetReviewTimer(ctx, problemID)
}

func (p *ProblemService) DeleteProblem(ctx context.Context, problemID int64) error {
	return p.q.DeleteProblem(ctx, problemID)
}

func (p *ProblemService) GetStats(ctx context.Context) (database.GetProblemStatisticsRow, error) {
	return p.q.GetProblemStatistics(ctx)
}

func (p *ProblemService) GetProblemByTopic(ctx context.Context) ([]database.GetProblemsByTopicRow, error) {
	return p.q.GetProblemsByTopic(ctx)
}

func (p *ProblemService) UpdateProbleNotes(ctx context.Context, args database.UpdateProblemNotesParams) error {
	return p.q.UpdateProblemNotes(ctx, args)
}

func (p *ProblemService) SearchProblems(ctx context.Context, args database.SearchProblemsParams) ([]database.SearchProblemsRow, error) {
	return p.q.SearchProblems(ctx, args)
}
