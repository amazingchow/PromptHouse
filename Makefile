
.PHONY: help
help: ### Display this help screen.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: install_deps_locally
install_deps_locally: ### Install the dependencies locally.
	@(npm install)

.PHONY: lint
lint: ### Lint the code.
	@(npm run lint)

.PHONY: run_locally
run_locally: ### Run the app locally.
	@(npm run dev)

.PHONY: build
build: ### Build the app.
	@(npm run build)
