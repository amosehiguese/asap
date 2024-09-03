package auth_api

type SignUpPayload struct {
	FirstName string `json:"firstname" validate:"required,lte=255"`
	LastName  string `json:"lastname" validate:"required,lte=255"`
	Email     string `json:"email" validate:"required,email,lte=255"`
	Password  string `json:"password" validate:"required,lte=255"`
	Role      string `json:"role" validate:"required,lte=25"`
}

type VerificationEmailPayload struct {
	Token string `json:"token" validate:"required"`
	Email string `json:"email" validate:"required,email,lte=255"`
}

type SignInPayload struct {
	Email    string `json:"email" validate:"required,email,lte=255"`
	Password string `json:"password" validate:"required,lte=255"`
}

type ForgotPasswordPayload struct {
	Email string `json:"email" validate:"required,email,lte=255"`
}

type PasswordResetPayload struct {
	Token    string `json:"token" validate:"required"`
	Email    string `json:"email" validate:"required,email,lte=255"`
	Password string `json:"password" validate:"required,lte=255"`
}
