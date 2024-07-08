package config

import "pkg/utils"

type serverConfig struct {
	Port        string
	Address     string
	ReadTimeout string
	Origin      string
}

func setServerConfig() *serverConfig {
	var s serverConfig
	utils.MustMapEnv(&s.Address, "SERVER_ADDR")
	utils.MustMapEnv(&s.Port, "SERVER_PORT")
	utils.MustMapEnv(&s.ReadTimeout, "SERVER_READ_TIMEOUT")
	utils.MustMapEnv(&s.Origin, "ORIGIN")

	return &s
}
