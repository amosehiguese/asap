package utils

import (
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func MustMapEnv(target *string, envKey string) {
	v := os.Getenv(envKey)
	if v == "" {
		panic(fmt.Sprintf("environment variable %q not set", envKey))
	}
	*target = v
}
