package config

import "pkg/utils"

type databaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SslMode  string
}

func setDatabaseConfig() *databaseConfig {
	var d databaseConfig
	utils.MustMapEnv(&d.Host, "DATABASE_HOST")
	utils.MustMapEnv(&d.Port, "DATABASE_PORT")
	utils.MustMapEnv(&d.User, "DATABASE_USER")
	utils.MustMapEnv(&d.Password, "DATABASE_PASSWORD")
	utils.MustMapEnv(&d.Name, "DATABASE_NAME")
	utils.MustMapEnv(&d.SslMode, "DATABASE_SSLMODE")

	return &d
}
