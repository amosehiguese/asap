package auth

import (
	"errors"

	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenMetadata struct {
	UserID      uuid.UUID
	Credentials map[string]bool
	Role        string
	Exp         int64
}

func ExtractTokenMetadata(c *fiber.Ctx, name string) (*TokenMetadata, error) {
	token, err := verifyToken(c, name)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		userID, err := uuid.Parse(claims["id"].(string))
		if err != nil {
			return nil, err
		}

		exp := int64(claims["exp"].(float64))
		role := claims["role"].(string)

		credentials := map[string]bool{
			// User
			"user:create": claims["user:create"].(bool),
			"user:read":   claims["user:read"].(bool),
			"user:update": claims["user:update"].(bool),
		}

		return &TokenMetadata{
			UserID:      userID,
			Credentials: credentials,
			Role:        role,
			Exp:         exp,
		}, nil
	}

	return nil, err
}

func extractToken(c *fiber.Ctx, name string) (string, error) {
	token := c.Cookies(name)
	if token == "" {
		return "", errors.New("missing JWT")
	}
	return token, nil
}

func verifyToken(c *fiber.Ctx, name string) (*jwt.Token, error) {
	config := config.GetConfig().Security
	tokenString, err := extractToken(c, name)
	if err != nil {
		return nil, err
	}
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.JwtSecretKey), nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil
}
