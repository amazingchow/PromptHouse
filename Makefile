# =============================================================================
# GLOBAL VARIABLES
# =============================================================================
.DEFAULT_GOAL := help
SHELL         := /bin/bash

# Project metadata
PROJECT_NAME := prompt-house-web
VERSION      := $(shell git describe --tags --always --dirty 2>/dev/null || echo "v0.1.0")
COMMIT_HASH  := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_TIME   := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

# Docker variables
DOCKER_IMAGE     := $(PROJECT_NAME):latest
DOCKER_CONTAINER := $(PROJECT_NAME)
DOCKER_PORT      := 13032
HOST_PORT        := 13032

# Node variables
NODE_FILES := $(shell find app components lib -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) 2>/dev/null)
CURR_DIR   := $(shell pwd)

# =============================================================================
# TARGETS
# =============================================================================

.PHONY: help
help:  ## Display this help screen
	@echo "$(PROJECT_NAME)"
	@echo "Current Version: $(VERSION) ($(COMMIT_HASH))"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Dependencies

.PHONY: install
install: ## Install dependencies
	@echo "Installing dependencies..."
	@npm install

##@ Code Quality

.PHONY: fmt
fmt: ## Format code with prettier
	@echo "Formatting code..."
	@npm run lint --silent || true

.PHONY: lint
lint: ## Run linters and fix issues
	@echo "Running linters..."
	@npm run lint --silent || true

.PHONY: all
all: clean lint ## Clean, lint

##@ Development Server

.PHONY: dev
dev: ## Run development server with hot-reload
	@echo "Starting development server..."
	@npm run dev

.PHONY: build
build: ## Build production bundle
	@echo "Building production bundle..."
	@npm run build

.PHONY: start
start: ## Run production server
	@echo "Starting production server..."
	@npm run start

##@ Docker - Production

.PHONY: docker-build
docker-build: ## Build production Docker image
	@echo "Building production Docker image..."
	@docker build -t $(DOCKER_IMAGE) -f Dockerfile .

.PHONY: docker-run
docker-run: ## Run production server in Docker
	@echo "Running production server in Docker..."
	@docker run -d --name=$(DOCKER_CONTAINER) --network=host --restart=unless-stopped $(DOCKER_IMAGE)
	@echo "Production server running at http://localhost:$(HOST_PORT)"

.PHONY: docker-up
docker-up: docker-build docker-run ## Build and run production server in Docker

.PHONY: docker-stop
docker-stop: ## Stop Docker container
	@echo "Stopping Docker container..."
	@docker stop $(DOCKER_CONTAINER) 2>/dev/null || true

.PHONY: docker-restart
docker-restart: docker-stop docker-run ## Restart Docker container

.PHONY: docker-logs
docker-logs: ## Show Docker container logs
	@docker logs -f $(DOCKER_CONTAINER) 2>/dev/null

.PHONY: docker-clean
docker-clean: docker-stop ## Remove Docker container and image
	@echo "Cleaning Docker resources..."
	@docker rm $(DOCKER_CONTAINER) 2>/dev/null || true
	@docker rmi $(DOCKER_IMAGE) 2>/dev/null || true

##@ Cleanup

.PHONY: clean
clean: ## Clean temporary files and caches
	@echo "Cleaning..."
	@rm -rf .next
	@rm -rf .turbo
	@rm -rf out
	@rm -rf build
	@rm -rf node_modules/.cache
	@find . -type f -name '.DS_Store' -delete

.PHONY: clean-all
clean-all: clean docker-clean ## Clean everything including Docker resources
	@echo "Cleaning all..."
	@rm -rf node_modules
