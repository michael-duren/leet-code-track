# Simple Makefile for a Go project

# Variables
BINARY_NAME=leet-track
BUILD_DIR=build
FRONTEND_DIR=frontend
DIST_DIR=dist

# Build the application
all: build

build: build-frontend build-backend

build-frontend:
	@echo "Building frontend..."
	@cd $(FRONTEND_DIR) && npm ci && npm run build
	@echo "Frontend built successfully"

build-backend:
	@echo "Building backend..."
	@go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME) cmd/api/main.go
	@echo "Backend built successfully as $(BUILD_DIR)/$(BINARY_NAME)"

# Install to system PATH (optional)
install: build
	@echo "Installing $(BINARY_NAME) to /usr/local/bin/"
	@sudo cp $(BUILD_DIR)/$(BINARY_NAME) /usr/local/bin/
	@echo "$(BINARY_NAME) installed successfully"

# Run the application
run:
	@go run cmd/api/main.go

# Run in development mode (separate frontend/backend)
dev:
	@echo "Starting development mode..."
	@echo "Frontend will run on http://localhost:3000"
	@echo "Backend will run on http://localhost:8080"
	@cd $(FRONTEND_DIR) && npm run dev &
	@go run cmd/api/main.go

# Test the application
test:
	@echo "Testing..."
	@go test ./... -v

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@rm -f main
	@cd $(FRONTEND_DIR) && rm -rf node_modules dist
	@echo "Cleaned successfully"

# Generate database code
db:
	@echo "Generating sqlc..."
	@sqlc generate

# Live Reload
watch:
	@if command -v air > /dev/null; then \
		air; \
		echo "Watching..."; \
	else \
		read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
		if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
			go install github.com/air-verse/air@latest; \
			air; \
			echo "Watching..."; \
		else \
			echo "You chose not to install air. Exiting..."; \
			exit 1; \
		fi; \
	fi

# Create build directory
$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

# Help
help:
	@echo "Available commands:"
	@echo "  build          - Build both frontend and backend"
	@echo "  build-frontend - Build only frontend"
	@echo "  build-backend  - Build only backend"
	@echo "  install        - Install binary to system PATH"
	@echo "  run            - Run in production mode"
	@echo "  dev            - Run in development mode"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  db             - Generate database code"
	@echo "  watch          - Live reload development"

.PHONY: all build build-frontend build-backend install run dev test clean db watch help
