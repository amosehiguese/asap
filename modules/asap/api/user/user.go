package user_api

import (
	"pkg/config"

	"asap/store"

	"go.uber.org/zap"
)

type UserHandler struct {
	store.DB
	IUser
	*zap.Logger
	*config.Config
}

func NewUserHandler(u IUser, db store.DB, log *zap.Logger) *UserHandler {
	return &UserHandler{
		DB:     db,
		Logger: log,
		IUser:  u,
		Config: config.GetConfig(),
	}
}
