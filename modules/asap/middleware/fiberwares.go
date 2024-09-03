package middleware

import (
	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"go.uber.org/zap"
)

func FiberMiddleware(a *fiber.App, logger *zap.Logger, c *config.Config) {
	a.Use(
		cors.New(
			cors.Config{
				AllowOrigins:     c.Cors.Origins,
				AllowMethods:     c.Cors.Methods,
				AllowHeaders:     c.Cors.Headers,
				AllowCredentials: c.Cors.Credentials,
			},
		),

		requestid.New(),
		setLogger(logger),
	)
}
