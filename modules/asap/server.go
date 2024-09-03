package main

import (
	"fmt"
	"os"
	"os/signal"
	"strconv"
	"time"

	"asap/middleware"
	"asap/routes"
	"asap/store"
	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func run(log *zap.Logger) error {
	config := config.GetConfig()

	rT, err := strconv.Atoi(config.Server.ReadTimeout)
	if err != nil {
		log.Error("Failed to get server read timeout")
		return err
	}

	app := fiber.New(fiber.Config{
		ReadTimeout: time.Duration(rT) * time.Second,
	})
	// Set up DB
	db := store.GetDBClient()
	// Migrate
	db.AutoMigrate()
	log.Info("connection to database established", zap.String("port", config.Database.Port))

	// Set up Redis
	rc, _ := store.RedisConn(config)

	// Middlewares
	middleware.FiberMiddleware(app, log, config)

	// Set up Routes
	api := app.Group("/api")
	routes.MainRoutesV1(api, config, rc, log)
	log.Info("Routes set up successfully.")

	// Set up Server
	if config.Env == "dev" {
		startServer(app, *config, log)
	} else {
		startServerWithGracefulShutdown(app, *config, log)
	}

	return nil
}

func startServer(app *fiber.App, config config.Config, log *zap.Logger) error {
	addr := fmt.Sprintf("%s:%s", config.Server.Address, config.Server.Port)
	if err := app.Listen(addr); err != nil {
		log.Info("Server is not running!")
		return err
	}
	return nil
}

func startServerWithGracefulShutdown(app *fiber.App, config config.Config, log *zap.Logger) error {
	done := make(chan struct{})

	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt)
		<-sig

		if err := app.Shutdown(); err != nil {
			log.Error("Server is not shutting down")
		}
		log.Info("Server shutting down gracefully...")
		close(done)
	}()

	addr := fmt.Sprintf("%s:%s", config.Server.Address, config.Server.Port)
	if err := app.Listen(addr); err != nil {
		log.Info("Server is not running!")
		return err
	}

	<-done
	return nil
}
