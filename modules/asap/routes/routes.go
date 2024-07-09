package routes

import (
	"pkg/config"

	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

func MainRoutesV1(api fiber.Router, config config.Config, log *zap.Logger) {
	_ = api.Group("/v1")

	// user.UserRoutes(v1, config, log)
	// auth_route.AuthRoutes(v1, config, log)
}
