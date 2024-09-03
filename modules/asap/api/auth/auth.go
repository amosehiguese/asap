package auth_api

import (
	user_api "asap/api/user"
	"asap/services"
	"asap/store"
	"pkg/config"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type AuthHandler struct {
	store.DB
	user_api.IUser
	*store.Redis[AuthHandler]
	*zap.Logger
	*config.Config
}

func NewAuthHandler(u user_api.IUser, db store.DB, rc *redis.Client, log *zap.Logger) *AuthHandler {
	return &AuthHandler{
		DB:     db,
		Redis:  (*store.Redis[AuthHandler])(store.NewRedis[AuthHandler](rc)),
		Logger: log,
		IUser:  u,
		Config: config.GetConfig(),
	}
}

func (a *AuthHandler) ApiSendVerificationEmail(name, email, verificationToken string) error {
	nve := services.NewVerificationEmail(name, email, verificationToken)
	err := nve.SendVerificationEmail()
	if err != nil {
		return err
	}
	return nil
}

func (a *AuthHandler) ApiSendResetPasswordEmail(name, email, token, origin string) error {
	rpe := services.NewResetPasswordEmail(name, email, token, origin)
	err := rpe.SendResetPasswordEmail()
	if err != nil {
		return err
	}

	return nil
}
