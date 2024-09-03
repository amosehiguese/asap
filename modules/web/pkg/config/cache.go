package config

import (
	utils "pkg/utils"
)

type cacheConfig struct {
	Type     string
	Host     string
	Port     string
	Password string
	DbNo     string
}

func setCacheConfig() *cacheConfig {
	var c cacheConfig
	utils.MustMapEnv(&c.Type, "CACHE_TYPE")
	utils.MustMapEnv(&c.Host, "CACHE_HOST")
	utils.MustMapEnv(&c.Port, "CACHE_PORT")
	utils.MustMapEnv(&c.Password, "CACHE_PASSWORD")
	utils.MustMapEnv(&c.DbNo, "CACHE_DB_NUMBER")

	return &c
}
