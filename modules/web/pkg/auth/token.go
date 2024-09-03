package auth

import (
	"asap/store"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

type Token struct {
	Access  string
	Refresh string
}

func GenerateNewToken(u *store.User) (*Token, error) {
	accessToken, err := GenerateAccessToken(u.ID, u.Role)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateRefreshToken()
	if err != nil {
		return nil, err
	}

	return &Token{
		Access:  accessToken,
		Refresh: refreshToken,
	}, nil
}

func GenerateAccessToken(id string, role string) (string, error) {
	config := config.GetConfig().Security
	credentials, err := GetRoleCredentials(role)
	if err != nil {
		return "", err
	}

	minCount, err := strconv.Atoi(config.JwtSecretKeyExp)
	if err != nil {
		return "", err
	}

	claims := make(jwt.MapClaims)
	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(minCount)).Unix()
	claims["role"] = role

	claims["user:create"] = false
	claims["user:read"] = false
	claims["user:update"] = false

	for _, credential := range credentials {
		claims[credential] = true
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(config.JwtSecretKey))
	if err != nil {
		return "", err
	}

	return t, nil
}

func generateRefreshToken() (string, error) {
	config := config.GetConfig().Security
	hash := sha256.New()
	refresh := config.JwtRefreshKey + time.Now().String()

	_, err := hash.Write([]byte(refresh))
	if err != nil {
		return "", err
	}

	hoursCount, err := strconv.Atoi(config.JwtRefreshKeyExp)
	if err != nil {
		return "", err
	}

	expTime := fmt.Sprint(time.Now().Add(time.Hour * time.Duration(hoursCount)).Unix())
	t := hex.EncodeToString(hash.Sum(nil)) + "." + expTime

	return t, nil
}

func ParseRefreshToken(refreshToken string) (int64, error) {
	return strconv.ParseInt(strings.Split(refreshToken, ".")[1], 0, 64)
}

func AttachToCookie(c *fiber.Ctx, token string) {
	cfg := config.GetConfig()
	log := c.Locals("logger").(*zap.Logger)
	accessExp, _ := strconv.Atoi(cfg.Security.JwtSecretKeyExp)

	c.Cookie(&fiber.Cookie{
		Name:     "access",
		Value:    token,
		Expires:  time.Now().Add(time.Duration(accessExp * int(time.Hour))),
		HTTPOnly: true,
		SameSite: "lax",
		Secure:   cfg.Env == "prod",
	})
	log.Info("Access token stored in cookie")
}

func InvalidateTokenCookies(c *fiber.Ctx) {
	log := c.Locals("logger").(*zap.Logger)

	c.ClearCookie("access")
	log.Info("Cookie Invalidated!")

}
