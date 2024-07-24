VERSION ?= $(shell git describe --match 'v[0-9]*' --tags --always)
BIN_OUTPUT ?= bin/
WORKSPACE ?= .


.PHONY: tidy
tidy:
	go list -f '{{.Dir}}' -m | xargs -L1 go mod tidy -C

.PHONY: tests
tests:
	@echo "Running tests...\n"
	go list -f '{{.Dir}}' -m | xargs go test

.PHONY: build
build:
	@echo "\nBuilding server module...\n"
	go build -o bin/asap -ldflags="-X main.Version=$(VERSION)" $(WORKSPACE)/modules/asap

.PHONY: server
server: build
	@echo "\nStarting server...\n"
	./bin/asap

.PHONY: web
web:
	@echo "\nStarting react frontend...\n"
	pnpm --prefix modules/web run dev

.PHONY: init-sh
init-sh:
	@echo "\Initializing script...\n"
	chmod +x ./scripts/init.sh
	./scripts/init.sh
