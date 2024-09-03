package auth

import "fmt"

func GetRoleCredentials(role string) ([]string, error) {
	var credentials []string

	switch role {
	case UserRole:
		credentials = []string{
			// User
			UserCreateCredential,
			UserReadCredential,
			UserUpdateCredential,
		}
	default:
		return nil, fmt.Errorf("role '%v' does not exist", role)
	}

	return credentials, nil
}
