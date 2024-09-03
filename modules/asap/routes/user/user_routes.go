package user

import (
	user_api "asap/api/user"
	"asap/middleware"
	"asap/store"
	"pkg/config"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func UserRoutes(v1 fiber.Router, config config.Config, log *zap.Logger) {
	users := v1.Group("/u")

	db := store.GetDBClient()

	userHandler := user_api.NewUserHandler(user_api.NewUserRepo(), db, log)

	users.Get("/", middleware.JWTProtected(), userHandler.AllUsers)
	users.Get("/me", middleware.JWTProtected(), userHandler.CurrentUser)
	users.Get("/:id", middleware.JWTProtected(), userHandler.SingleUser)
	users.Post("/", middleware.JWTProtected(), userHandler.CreateUser)
	users.Patch("/modify", middleware.JWTProtected(), userHandler.UpdateUser)
	users.Patch("/modify-password", middleware.JWTProtected(), userHandler.ChangePassword)

}
