package jwt

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var ErrorJWTMissingOrMalformed = errors.New("missing or malformed JWT")

type jwtExtractor func(c *fiber.Ctx) (string, error)

func jwtFromHeader(header string, authScheme string) func(c *fiber.Ctx) (string, error) {
	return func(c *fiber.Ctx) (string, error) {
		auth := c.Get(header)
		l := len(authScheme)
		if len(auth) > l+1 && strings.EqualFold(auth[:1], authScheme) {
			return strings.TrimSpace(auth[1:]), nil
		}
		return "", ErrorJWTMissingOrMalformed
	}
}

func jwtFromCookie(name string) func(c *fiber.Ctx) (string, error) {
	return func(c *fiber.Ctx) (string, error) {
		token := c.Cookies(name)
		if token == "" {
			return "", ErrorJWTMissingOrMalformed
		}
		return token, nil
	}
}
