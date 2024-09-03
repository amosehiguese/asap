package middleware

import (
	"asap/store"
	"pkg/auth"
	"pkg/config"
	jwtware "pkg/jwt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func JWTProtected() fiber.Handler {
	sConfig := config.GetConfig().Security
	config := jwtware.Config{
		SigningKey:     jwtware.SigningKey{Key: []byte(sConfig.JwtSecretKey)},
		ContextKey:     "jwt",
		TokenLookup:    "cookie:access",
		ErrorHandler:   jwtError,
		SuccessHandler: jwtSuccess,
	}

	return jwtware.New(config)
}

func jwtError(c *fiber.Ctx, err error) error {
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

func jwtSuccess(c *fiber.Ctx) error {
	now := time.Now().Unix()
	config := config.GetConfig()

	accessToken := c.Cookies("access")
	claims, err := auth.ExtractTokenMetadata(c, accessToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	id := claims.UserID.String()
	role := claims.Role

	expAccessToken := claims.Exp
	if now > expAccessToken {
		connRedis, err := store.RedisConn(config)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": true,
				"msg":   err.Error(),
			})
		}

		refreshToken, err := connRedis.Get(c.Context(), id).Result()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": true,
				"msg":   err,
			})
		}

		refreshTokenExp, err := auth.ParseRefreshToken(refreshToken)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": true,
				"msg":   err,
			})
		}

		if now > refreshTokenExp {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": true,
				"msg":   "unauthorized, your session was ended earlier",
			})
		}

		newAccessToken, err := auth.GenerateAccessToken(id, role)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": true,
				"msg":   err.Error(),
			})
		}
		auth.AttachToCookie(c, newAccessToken)

		return c.Next()
	}

	return c.Next()
}
