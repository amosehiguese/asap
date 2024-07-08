package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

func createHash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GetHash(input string) string {
	return createHash(input)
}

func createTokenStr(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("error generating random bytes")
	}
	token := base64.StdEncoding.EncodeToString(bytes)
	return token, nil
}

func GetTokenStr(length int) (string, error) {
	return createTokenStr(length)
}
