package auth

import "fmt"

type Role string

const (
	UserRole Role = "user"
)

func VerifyRole(rl string) (Role, error) {
	var role Role
	switch rl {
	case string(UserRole):
		role = UserRole
	default:
		return "", fmt.Errorf("role '%v' does not exist", rl)
	}

	return role, nil
}
