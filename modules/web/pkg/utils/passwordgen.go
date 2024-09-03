package utils

import "golang.org/x/crypto/bcrypt"

func NormalizePassword(p string) []byte {
	return []byte(p)
}

func HashPassword(p string) string {
	pwd := NormalizePassword(p)
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		return err.Error()
	}

	return string(hash)
}
