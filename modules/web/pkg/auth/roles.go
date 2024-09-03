package auth

import "fmt"

const (
	UserRole string = "user"
)

func VerifyRole(rl string) (string, error) {
	var role string
	switch rl {
	case string(UserRole):
		role = UserRole
	default:
		return "", fmt.Errorf("role '%v' does not exist", rl)
	}

	return role, nil
}
