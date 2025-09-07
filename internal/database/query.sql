-- 1. Get all problems that need review today
SELECT 
    id,
    problem_number,
    title,
    difficulty,
    date_attempted,
    first_review_date,
    second_review_date,
    final_review_date,
    status,
    pattern,
    notes,
    CASE 
        WHEN status = 1 THEN date(date_attempted, '+3 days')
        WHEN status = 2 THEN date(first_review_date, '+7 days')
        WHEN status = 3 THEN date(second_review_date, '+20 days')
        ELSE NULL
    END as next_review_date
FROM problems 
WHERE status < 4  -- Not mastered
AND (
    (status = 1 AND date(date_attempted, '+3 days') <= date('now')) OR
    (status = 2 AND date(first_review_date, '+7 days') <= date('now')) OR
    (status = 3 AND date(second_review_date, '+20 days') <= date('now'))
)
ORDER BY date_attempted ASC;

-- 2. Get all problems with calculated next review date
SELECT 
    id,
    problem_number,
    title,
    difficulty,
    date_attempted,
    first_review_date,
    second_review_date,
    final_review_date,
    status,
    pattern,
    notes,
    CASE 
        WHEN status = 1 THEN date(date_attempted, '+3 days')
        WHEN status = 2 THEN date(first_review_date, '+7 days')
        WHEN status = 3 THEN date(second_review_date, '+20 days')
        ELSE NULL
    END as next_review_date,
    CASE 
        WHEN status = 4 THEN 'Mastered'
        WHEN status = 1 AND date(date_attempted, '+3 days') <= date('now') THEN 'Due'
        WHEN status = 2 AND date(first_review_date, '+7 days') <= date('now') THEN 'Due'
        WHEN status = 3 AND date(second_review_date, '+20 days') <= date('now') THEN 'Due'
        ELSE 'Scheduled'
    END as review_status
FROM problems 
ORDER BY date_attempted DESC;

-- 3. Insert new problem
INSERT INTO problems (problem_number, title, difficulty, pattern, notes)
VALUES (?, ?, ?, ?, ?);

-- 4. Update problem status (mark as reviewed)
-- For first review
UPDATE problems 
SET status = 2, first_review_date = CURRENT_TIMESTAMP 
WHERE id = ? AND status = 1;

-- For second review
UPDATE problems 
SET status = 3, second_review_date = CURRENT_TIMESTAMP 
WHERE id = ? AND status = 2;

-- For mastered
UPDATE problems 
SET status = 4, final_review_date = CURRENT_TIMESTAMP 
WHERE id = ? AND status = 3;

-- 5. Mark problem as needing more review (reset review timer but keep status)
UPDATE problems 
SET 
    first_review_date = CASE WHEN status = 2 THEN CURRENT_TIMESTAMP ELSE first_review_date END,
    second_review_date = CASE WHEN status = 3 THEN CURRENT_TIMESTAMP ELSE second_review_date END
WHERE id = ?;

-- 6. Get statistics
SELECT 
    COUNT(*) as total_problems,
    COUNT(CASE WHEN status = 4 THEN 1 END) as mastered_count,
    COUNT(CASE WHEN status = 1 THEN 1 END) as new_count,
    COUNT(CASE WHEN status = 2 THEN 1 END) as first_review_count,
    COUNT(CASE WHEN status = 3 THEN 1 END) as second_review_count,
    COUNT(CASE WHEN difficulty = 1 THEN 1 END) as easy_count,
    COUNT(CASE WHEN difficulty = 2 THEN 1 END) as medium_count,
    COUNT(CASE WHEN difficulty = 3 THEN 1 END) as hard_count
FROM problems;

-- 7. Get problems by pattern/topic
SELECT 
    pattern,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 4 THEN 1 END) as mastered,
    ROUND(COUNT(CASE WHEN status = 4 THEN 1 END) * 100.0 / COUNT(*), 1) as mastery_percentage
FROM problems 
WHERE pattern != ''
GROUP BY pattern
ORDER BY count DESC;

-- 8. Update problem notes
UPDATE problems 
SET notes = ? 
WHERE id = ?;

-- 9. Delete problem
DELETE FROM problems WHERE id = ?;

-- 10. Get problem by ID
SELECT 
    id,
    problem_number,
    title,
    difficulty,
    date_attempted,
    first_review_date,
    second_review_date,
    final_review_date,
    status,
    pattern,
    notes
FROM problems 
WHERE id = ?;

-- 11. Search problems by title or pattern
SELECT 
    id,
    problem_number,
    title,
    difficulty,
    pattern,
    status
FROM problems 
WHERE title LIKE ? OR pattern LIKE ?
ORDER BY problem_number ASC;
