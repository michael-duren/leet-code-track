-- Database Schema
CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty IN (1, 2, 3)), 
    date_attempted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_review_date DATETIME NULL,
    second_review_date DATETIME NULL,
    final_review_date DATETIME NULL,
    status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (1, 2, 3, 4)), 
    pattern TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_problem_number ON problems(problem_number);
CREATE INDEX IF NOT EXISTS idx_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_date_attempted ON problems(date_attempted);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_problems_updated_at 
    AFTER UPDATE ON problems
BEGIN
    UPDATE problems SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS study_plans (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level IN (1, 2, 3)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER IF NOT EXISTS update_study_plans_updated_at 
    AFTER UPDATE ON study_plans
    BEGIN 
      UPDATE study_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;


CREATE TABLE IF NOT EXISTS plan_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    problem_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    UNIQUE(plan_id, problem_id)
);
CREATE INDEX IF NOT EXISTS idx_plan_problem ON plan_problems(plan_id, problem_id);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problem_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS update_problem_notes_updated_at 
    AFTER UPDATE ON problem_notes
    BEGIN
      UPDATE problem_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;


