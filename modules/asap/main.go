package main

import (
	"go.uber.org/zap"
)

func main() {
	// Initialize logger
	log, _ := zap.NewProduction(zap.WithCaller(false))
	defer func() {
		_ = log.Sync()
	}()

	// Start server
	if err := run(log); err != nil {
		log.Fatal("Error starting server.")
	}
}
