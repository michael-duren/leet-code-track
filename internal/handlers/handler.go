// Package handlers - api handlers
package handlers

type Handlers struct {
	ProblemHandlers *ProblemHandlers
}

var handler *Handlers

func NewHandlers() *Handlers {
	if handler != nil {
		return handler
	}

	handler = &Handlers{
		ProblemHandlers: NewProblemHandlers(),
	}

	return handler
}
