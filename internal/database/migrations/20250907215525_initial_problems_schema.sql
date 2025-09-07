-- +goose Up
-- Database Schema for LeetCode tracking
CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty IN (1, 2, 3)), -- 1=Easy, 2=Medium, 3=Hard
    date_attempted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_review_date DATETIME NULL,
    second_review_date DATETIME NULL,
    final_review_date DATETIME NULL,
    status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (1, 2, 3, 4)), -- 1=New, 2=FirstReview, 3=SecondReview, 4=Mastered
    pattern TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_problem_number ON problems(problem_number);
CREATE INDEX IF NOT EXISTS idx_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_date_attempted ON problems(date_attempted);

-- +goose StatementBegin
CREATE TRIGGER IF NOT EXISTS update_problems_updated_at 
    AFTER UPDATE ON problems
    FOR EACH ROW
BEGIN
    UPDATE problems SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
DROP TRIGGER IF EXISTS update_problems_updated_at;
DROP INDEX IF EXISTS idx_date_attempted;
DROP INDEX IF EXISTS idx_status;
DROP INDEX IF EXISTS idx_problem_number;
DROP TABLE IF EXISTS problems;
