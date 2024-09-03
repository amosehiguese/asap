package routes

import (
	auth_route "asap/routes/auth"
	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

func MainRoutesV1(api fiber.Router, config *config.Config, rc *redis.Client, log *zap.Logger) {
	v1 := api.Group("/v1")

	// user.UserRoutes(v1, config, log)
	auth_route.AuthRoutes(v1, config, rc, log)
}
