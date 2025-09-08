# LeetCode Progress Tracker

A personal productivity tool designed to optimize coding interview preparation through intelligent spaced repetition. This application helps software engineers systematically track their progress on LeetCode problems, automatically scheduling reviews based on proven memory retention principles. Built with SolidJS, TypeScript, and SQLite, it provides a clean, fast interface for managing your algorithm practice journey from beginner fundamentals through advanced interview preparation.

## Getting Started

This project is currently a local implementation designed to track progress, study plans, and review schedules for LeetCode or other data structures and algorithms practice sites. The application uses spaced repetition methodology to ensure optimal retention of problem-solving patterns and techniques.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- SQLite3 (for database functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/leet-code-track.git
cd leet-code-track

# Install dependencies
go mod tidy
cd frontend && npm install

# DB Setup
# If the database does not exist it will be created when starting
# the go lang server
# You can optionally run the seed.sql file to add some problems
# to test with
```

## Features

- **Spaced Repetition System**: Automatically schedules problem reviews based on your performance (3 days → 1 week → 3 weeks → mastered)
- **Progress Tracking**: Visual dashboard showing completion rates by difficulty, pattern recognition, and overall mastery
- **Pattern Classification**: Organize problems by algorithmic patterns (Two Pointers, Dynamic Programming, etc.)
- **Review Queue Management**: Daily review lists prioritized by due date and importance
- **Performance Analytics**: Track your improvement over time with detailed statistics
- **Local Data Storage**: All data stored locally in SQLite - no external dependencies or data sharing

## Technology Stack

- **Frontend**: SolidJS with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite3 with custom SQL queries
- **Build Tool**: Vite
- **Testing**: Vitest

## Database Schema

The application uses a single SQLite table with intelligent status tracking:

- **New** (Status 1): Recently attempted problems
- **First Review** (Status 2): Problems reviewed after 3 days
- **Second Review** (Status 3): Problems reviewed after 1 week
- **Mastered** (Status 4): Problems reviewed after 3 weeks

## MakeFile

Run build make command with tests

```bash
make all
```

Build the application

```bash
make build
```

Run the application

```bash
make run
```

Live reload the application:

```bash
make watch
```

Run the test suite:

```bash
make test
```

Clean up binary from the last build:

```bash
make clean
```

## Usage

### Adding a New Problem

1. Navigate to "Add Problem" in the main menu
2. Enter the LeetCode problem number, title, and difficulty
3. Classify the problem by algorithmic pattern
4. Add personal notes about your approach or solution

### Daily Review Workflow

1. Check the home dashboard for problems due today
2. Attempt to solve each problem from memory
3. Mark as "Reviewed" if successful, or "Needs More Review" if you struggled
4. The system automatically schedules the next review based on your performance

### Tracking Progress

- View completion statistics by difficulty level
- Monitor mastery rates for different algorithmic patterns
- Track your daily review consistency
- Export progress data for external analysis

## Interview Preparation Strategy

This tool implements a proven study methodology for technical interviews:

1. **Foundation Building** (Weeks 1-8): Focus on easy problems, establish patterns
2. **Skill Development** (Weeks 9-16): Medium problems, pattern reinforcement
3. **Advanced Preparation** (Weeks 17-24): Hard problems, interview simulation
4. **Maintenance Phase** (Ongoing): Spaced repetition to retain knowledge

## Contributing

This is a personal productivity tool, but contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Roadmap

- [ ] Data export/import functionality
- [ ] Integration with LeetCode API for automatic problem data
- [ ] Mobile-responsive design improvements
- [ ] Advanced analytics and progress visualization
- [ ] Team/study group sharing features
- [ ] Integration with other coding platforms (HackerRank, CodeSignal)

## Acknowledgments

- Inspired by spaced repetition systems like Anki
- Built for software engineers preparing for technical interviews at top tech companies
- Special thanks to the LeetCode community for problem classification and pattern identification
