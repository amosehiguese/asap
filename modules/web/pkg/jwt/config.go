package jwt

import (
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var ErrJWTAlg = errors.New("the JWT header did not contain the expected algorithm")

type Config struct {
	// SuccessHandler defines a function which is executed for a valid token.
	SuccessHandler fiber.Handler

	// ErrorHandler defines a function which is executed for an invalid token.
	ErrorHandler fiber.ErrorHandler

	// Signing key to validate token
	SigningKey SigningKey

	// Map of signing keys to validate token with kid field usage.
	SigningKeys map[string]SigningKey

	// Claims are extendable claims data defining token content
	// Default value jwt.MapClaims
	Claims jwt.Claims

	// TokenLookup is a string in the form of "<source>:<name>" that is used to
	// extract token from the context.
	// Default value "header:Authorization"
	TokenLookup string

	// AuthScheme to be used in the Authorization header.
	// Default: "Bearer"
	AuthScheme string

	// Context key to store user information from the token into context.
	// Optional
	ContextKey string

	// KeyFunc is a function that supplies the public key for JWT cryptographic verification.
	// The function shall take care of verifying the signing algorithm and selecting the proper key
	// At least one of the following is required: KeyFunc, SigningKeys, SigningKey
	KeyFunc jwt.Keyfunc

	// JWKSetURLs is a slice of HTTP URLs that contain the JSON Web Key Set(JWKS) used to verify the signature of
	// JWTS. Use of HTTPS is recommended.
	// By defaults, all JWK Sets in this slice will:
	// 		* Refresh every hour
	// 		* Refresh automatically if a new "kid"  is seen in a JWT being verified
	// 		* Rate limit refreshes to once every 5 minutes
	// 		* Timeout refreshes after 10 seconds.
	JWKSetsURLs []string
}

type SigningKey struct {
	// JWTAlg is the algorithm used to sign JWTs.
	JWTAlg string

	// Key is the cryptographic key used to sign JWTs.
	Key any
}

func makeCfg(config []Config) Config {
	var cfg Config
	if len(config) > 0 {
		cfg = config[0]
	}

	if cfg.SuccessHandler == nil {
		cfg.SuccessHandler = func(c *fiber.Ctx) error {
			return c.Next()
		}
	}

	if cfg.ErrorHandler == nil {
		cfg.ErrorHandler = func(c *fiber.Ctx, err error) error {
			if err.Error() == ErrorJWTMissingOrMalformed.Error() {
				return c.Status(fiber.StatusBadRequest).SendString(ErrorJWTMissingOrMalformed.Error())
			}
			return c.Status(fiber.StatusUnauthorized).SendString("Invalid or expired JWT")
		}
	}

	if cfg.SigningKey.Key == nil && len(cfg.SigningKeys) == 0 {
		panic("Fiber: JWT middleware configuration: At least one to the following is required: SigningKeys or SigningKey.")
	}

	if cfg.ContextKey == "" {
		cfg.ContextKey = "user"
	}

	if cfg.Claims == nil {
		cfg.Claims = jwt.MapClaims{}
	}

	if cfg.TokenLookup == "" {
		cfg.TokenLookup = defaultTokenLookup
		if cfg.AuthScheme == "" {
			cfg.AuthScheme = "Bearer"
		}
	}

	if cfg.KeyFunc == nil {
		if len(cfg.SigningKeys) > 0 || len(cfg.JWKSetsURLs) > 0 {
			var givenKeys map[string]keyfunc.GivenKey
			if cfg.SigningKeys != nil {
				givenKeys = make(map[string]keyfunc.GivenKey, len(cfg.SigningKeys))
				for kid, key := range cfg.SigningKeys {
					givenKeys[kid] = keyfunc.NewGivenCustom(key.Key, keyfunc.GivenKeyOptions{
						Algorithm: key.JWTAlg,
					})
				}
			}
			if len(cfg.JWKSetsURLs) > 0 {
				var err error
				cfg.KeyFunc, err = multiKeyfunc(givenKeys, cfg.JWKSetsURLs)
				if err != nil {
					panic("Failed to create keyfunc from JWK Set URL:" + err.Error())
				}
			} else {
				cfg.KeyFunc = keyfunc.NewGiven(givenKeys).Keyfunc
			}
		} else {
			cfg.KeyFunc = signingKeyFunc(cfg.SigningKey)
		}
	}

	return cfg
}

func multiKeyfunc(givenKeys map[string]keyfunc.GivenKey, jwtSetURLs []string) (jwt.Keyfunc, error) {
	opts := keyfuncOptions(givenKeys)
	multiple := make(map[string]keyfunc.Options, len(jwtSetURLs))
	for _, url := range jwtSetURLs {
		multiple[url] = opts
	}
	multiOps := keyfunc.MultipleOptions{
		KeySelector: keyfunc.KeySelectorFirst,
	}
	multi, err := keyfunc.GetMultiple(multiple, multiOps)
	if err != nil {
		return nil, fmt.Errorf("failed to get multiple JWK Set URLS: %w", err)
	}

	return multi.Keyfunc, nil
}

func keyfuncOptions(givenKey map[string]keyfunc.GivenKey) keyfunc.Options {
	return keyfunc.Options{
		GivenKeys: givenKey,
		RefreshErrorHandler: func(err error) {
			log.Printf("Failed to perform background refresh of JWK Set: %s", err)
		},
		RefreshInterval:   time.Hour,
		RefreshRateLimit:  time.Minute * 5,
		RefreshTimeout:    time.Second * 10,
		RefreshUnknownKID: true,
	}
}

func (cfg *Config) getExtractors() []jwtExtractor {
	extractor := make([]jwtExtractor, 0)
	rootParts := strings.Split(cfg.TokenLookup, ",")
	for _, rootPart := range rootParts {
		parts := strings.Split(strings.TrimSpace(rootPart), ":")

		switch parts[0] {
		case "header":
			extractor = append(extractor, jwtFromHeader(parts[1], cfg.AuthScheme))
		case "cookie":
			extractor = append(extractor, jwtFromCookie(parts[1]))
		}

	}

	return extractor
}

func signingKeyFunc(key SigningKey) jwt.Keyfunc {
	return func(t *jwt.Token) (interface{}, error) {
		if key.JWTAlg != "" {
			alg, ok := t.Header["alg"].(string)
			if !ok {
				return nil, fmt.Errorf("unexpected jwt signing method: expected: %q: got: missing or expected JSON type", key.JWTAlg)
			}
			if alg != key.JWTAlg {
				return nil, fmt.Errorf("unexpected jwt signing method: expected: %q: got: %q", key.JWTAlg, alg)
			}
		}
		return key.Key, nil
	}
}
