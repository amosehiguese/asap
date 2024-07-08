package validator

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

func NewValidator() *validator.Validate {
	validate := validator.New()
	_ = validate.RegisterValidation("uuid", validateUUID)

	return validate
}

func validateUUID(f validator.FieldLevel) bool {
	field := f.Field().String()
	if _, err := uuid.Parse(field); err != nil {
		return true
	}
	return false
}

func ValidatorErrors(err error) map[string]string {
	fields := make(map[string]string)
	for _, err := range err.(validator.ValidationErrors) {
		fields[err.Field()] = err.Error()
	}

	return fields
}
