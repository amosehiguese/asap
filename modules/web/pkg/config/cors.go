package config

import (
	utils "pkg/utils"
)

type corsConfig struct {
	Origins     string
	Methods     string
	Headers     string
	Credentials bool
}

func setCorsConfig() *corsConfig {
	var c corsConfig
	utils.MustMapEnv(&c.Origins, "CORS_ORIGINS")
	utils.MustMapEnv(&c.Methods, "CORS_METHODS")
	utils.MustMapEnv(&c.Headers, "CORS_HEADERS")

	var credentials string
	utils.MustMapEnv(&credentials, "CORS_ALLOW_CREDENTIALS")
	if credentials == "true" {
		c.Credentials = true
	} else {
		c.Credentials = false
	}

	return &c
}
