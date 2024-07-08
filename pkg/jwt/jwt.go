package jwt

import (
	"reflect"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

var defaultTokenLookup = "header:" + fiber.HeaderAuthorization

func New(config ...Config) fiber.Handler {
	cfg := makeCfg(config)
	extractors := cfg.getExtractors()

	return func(c fiber.Ctx) error {
		var auth string
		var err error

		for _, extractor := range extractors {
			auth, err = extractor(c)
			if auth != "" && err == nil {
				break
			}
		}
		if err != nil {
			return cfg.ErrorHandler(c, err)
		}

		var token *jwt.Token
		if _, ok := cfg.Claims.(jwt.MapClaims); ok {
			token, err = jwt.Parse(auth, cfg.KeyFunc)
		} else {
			t := reflect.ValueOf(cfg.Claims).Type().Elem()
			claims := reflect.New(t).Interface().(jwt.Claims)
			token, err = jwt.ParseWithClaims(auth, claims, cfg.KeyFunc)
		}

		if err == nil && token.Valid {
			c.Locals(cfg.ContextKey, token)
			return cfg.SuccessHandler(c)
		}

		return cfg.ErrorHandler(c, err)
	}
}
