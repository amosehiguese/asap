package middleware

import (
	"pkg/config"
	jwtware "pkg/jwt"

	"github.com/gofiber/fiber/v3"
)

func JWTProtected() fiber.Handler {
	sConfig := config.GetConfig().Security
	config := jwtware.Config{
		SigningKey:   jwtware.SigningKey{Key: []byte(sConfig.JwtSecretKey)},
		ContextKey:   "jwt",
		ErrorHandler: jwtError,
	}

	return jwtware.New(config)
}

func jwtError(c fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": true,
		"msg":   err.Error(),
	})
}
