package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"go.uber.org/zap"
)

func setLogger(l *zap.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		c.Locals("logger", l)

		err := c.Next()

		l.Info("served request",
			zap.String("proto", c.Protocol()),
			zap.String("method", c.Method()),
			zap.String("path", c.Path()),
			zap.Duration("lat", time.Since(start)),
			zap.Int("status", c.Response().StatusCode()),
			zap.Int("size", len(c.Response().Body())),
		)
		return err
	}

}
