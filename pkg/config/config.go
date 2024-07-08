package config

import "pkg/utils"

type config struct {
	Env         string
	Server      *serverConfig
	Database    *databaseConfig
	Security    *securityConfig
	SMTP        *smtpConfig
	ObjectStore *objectStoreConfig
}

var c config

func initConfig() *config {
	c.Server = setServerConfig()
	c.Database = setDatabaseConfig()
	c.Security = setSecurityConfig()
	c.ObjectStore = setObjectStoreConfig()
	c.SMTP = setSmtpConfig()
	utils.MustMapEnv(&c.Env, "ENV")

	return &c
}

func GetConfig() *config {
	if c.Server == nil || c.Database == nil || c.Security == nil || c.ObjectStore == nil {
		c = *initConfig()
	}
	return &c
}
