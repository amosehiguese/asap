package auth_route

import (
	auth_api "asap/api/auth"
	user_api "asap/api/user"
	"asap/middleware"
	"asap/store"
	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

func AuthRoutes(v1 fiber.Router, config *config.Config, rc *redis.Client, log *zap.Logger) {
	auth := v1.Group("/auth")
	db := store.GetDBClient()

	authHandler := auth_api.NewAuthHandler(user_api.NewUserRepo(), db, rc, log)

	auth.Post("/signup", authHandler.Signup)
	auth.Post("/login", authHandler.Login)
	auth.Delete("/logout", middleware.JWTProtected(), authHandler.Logout)
	auth.Post("/verify-email", authHandler.VerifyEmail)
	auth.Post("/reset-password", authHandler.ResetPassword)
	auth.Post("/forgot-password", authHandler.ForgotPassword)
}
