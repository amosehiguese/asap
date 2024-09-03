package auth_api

import (
	"context"
	"time"

	"asap/store"
	"pkg/auth"
	"pkg/utils"
	"pkg/validator"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Signup handler to register a new user
// @Description Create a new user and sends verification email
// @Summary create a new user
// @Tags User
// @Accept json
// @Produce json
// @Param firstname body string true "Firstname"
// @Param lastname body string true "Lastname"
// @Param email body string true "Email"
// @Param password body string true "Password"
// @Param role body string true "Role"
// @Success 200 {string} status "ok"
// @Router /api/v1/auth/signup [post]
func (a *AuthHandler) Signup(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var signUpPayload SignUpPayload
	if err := c.BodyParser(&signUpPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}
	signUpPayload.Role = "user"

	validate := validator.NewValidator()
	if err := validate.Struct(signUpPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	role, err := auth.VerifyRole(signUpPayload.Role)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	verificationToken, err := utils.GetEmailVerificationToken()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	user := &store.User{}
	user.CreatedAt = time.Now()
	user.FirstName = signUpPayload.FirstName
	user.LastName = &signUpPayload.LastName
	user.Email = signUpPayload.Email
	user.Password = signUpPayload.Password
	user.VerificationToken = verificationToken
	user.Role = role

	if err := validate.Struct(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	go a.ApiSendVerificationEmail(user.FirstName, user.Email, verificationToken)

	user, err = a.Create(ctx, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	user.Password = ""

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"error": false,
		"msg":   "Please check your email to verify account",
	})
}

// VerifyEmail handler to handle email verification for a new user
// @Description Validates verification email payload and verifies new user
// @Summary verifies a new user
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "Email"
// @Param token body string true "Token"
// @Success 200 {object} models.User
// @Router /api/v1/auth/verify-email [post]
func (a *AuthHandler) VerifyEmail(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var verificationEmailPayload VerificationEmailPayload
	if err := c.BodyParser(&verificationEmailPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := validator.NewValidator()
	if err := validate.Struct(verificationEmailPayload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	u, err := a.GetByEmail(ctx, verificationEmailPayload.Email)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	if u.VerificationToken != verificationEmailPayload.Token {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "Verification Failed. Invalid request",
		})
	}

	now := time.Now()
	u.Verified = &now
	u.IsVerified = true
	u.VerificationToken = ""

	if err := a.Save(ctx, u); err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to persist user to db")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": "false",
		"msg":   "Email Verified",
	})
}

// Login method to auth user and return access and refresh tokens.
// @Description AuthHandler user and return access and refresh token.
// @Summary auth user and return access and refresh token
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "User Email"
// @Param password body string true "User Password"
// @Success 200 {string} status "ok"
// @Router /api/v1/auth/login [post]
func (a *AuthHandler) Login(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var signInPayload SignInPayload
	if err := c.BodyParser(&signInPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("request payload invalid")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := validator.NewValidator()
	if err := validate.Struct(signInPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("payload validation failed")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	u, err := a.GetByEmail(ctx, signInPayload.Email)
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("user with the given email not found")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "user with the given email is not found",
		})
	}

	if !u.IsVerified {
		a.With(
			zap.Error(err),
		).Error("user is not verified")

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": true,
			"msg":   "please verify your email",
		})
	}

	passwordSame := u.ComparePasswordHash(signInPayload.Password)
	if !passwordSame {
		a.With(
			zap.Error(err),
		).Error("request payload password differs from db password")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "wrong user password",
		})
	}

	tokens, err := auth.GenerateNewToken(u)
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to generate new tokens")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	auth.AttachToCookie(c, tokens.Access)

	err = a.Redis.RC.Set(ctx, u.ID, tokens.Refresh, 0).Err()
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to store refresh token")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"tokens": fiber.Map{
			"user_id": u.ID,
			"email":   u.Email,
			"role":    u.Role,
		},
	})
}

// Logout method to de-authorize user and delete refresh token from Redis.
// @Description De-authorize user and delete refresh token from Redis.
// @Summary de-authorize user and delete refresh token from Redis
// @Tags User
// @Accept json
// @Produce json
// @Success 204 {string} status "ok"
// @Security ApiKeyAuth
// @Router /api/v1/auth/logout [Delete]
func (a *AuthHandler) Logout(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.Context(), 5*time.Second)
	defer cancel()

	claims, err := auth.ExtractTokenMetadata(c, "access")
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to extract token metadata")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	userID := claims.UserID.String()

	if err := a.RC.Del(ctx, userID).Err(); err != nil {
		a.With(
			zap.Error(err),
		).Error("token deletion failed")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	auth.InvalidateTokenCookies(c)

	return c.SendStatus(fiber.StatusNoContent)
}

// ForgotPassword handler to handle forgotten user password by sending verification token to user email
// @Description sends a reset password verification token user email
// @Summary sends reset password verification token
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "Email"
// @Success 200 {object} models.User
// @Router /api/v1/auth/forgot-password [post]
func (a *AuthHandler) ForgotPassword(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	var forgotPasswordPayload ForgotPasswordPayload
	if err := c.BodyParser(&forgotPasswordPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("request payload invalid")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := validator.NewValidator()
	if err := validate.Struct(forgotPasswordPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("payload validation failed")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	u, err := a.GetByEmail(ctx, forgotPasswordPayload.Email)
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("user with the given email not found")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "user with the given email is not found",
		})
	}

	if !u.IsVerified {
		a.With(
			zap.Error(err),
		).Error("user is not verified")

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": true,
			"msg":   "please verify your email",
		})
	}

	origin := a.Server.Origin
	passwordToken, err := utils.GetTokenStr(40)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// Send ResetPasswordEmail
	if err := a.ApiSendResetPasswordEmail(u.FirstName, u.Email, passwordToken, origin); err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to send reset password email")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	hashPasswordToken := utils.GetHash(passwordToken)
	passwordTokenExp := time.Now().Add(time.Minute * 10)

	u.PasswordToken = &hashPasswordToken
	u.PasswordTokenExpirationDate = &passwordTokenExp

	if err := a.Save(ctx, u); err != nil {
		a.With(
			zap.Error(err),
		).Error("failed to persist user to db")

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": "false",
		"msg":   "Please check your email for reset password link",
	})
}

// ResetPassword handler to handle password reset for user
// @Description validates password reset payload and modifies user password
// @Summary handler password reset
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "Email"
// @Param token body string true "Token"
// @Param password body string true "Password"
// @Success 200 {object} models.User
// @Router /api/v1/auth/reset-password [post]
func (a *AuthHandler) ResetPassword(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var passwordResetPayload PasswordResetPayload
	if err := c.BodyParser(&passwordResetPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("request payload invalid")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	validate := validator.NewValidator()
	if err := validate.Struct(passwordResetPayload); err != nil {
		a.With(
			zap.Error(err),
		).Error("payload validation failed")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   validator.ValidatorErrors(err),
		})
	}

	u, err := a.GetByEmail(ctx, passwordResetPayload.Email)
	if err != nil {
		a.With(
			zap.Error(err),
		).Error("user with the given email not found")

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "user with the given email is not found",
		})
	}

	if !u.IsVerified {
		a.With(
			zap.Error(err),
		).Error("user is not verified")

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": true,
			"msg":   "please verify your email",
		})
	}
	now := time.Now()
	pExp := u.PasswordTokenExpirationDate

	passwordTokenHash := utils.GetHash(passwordResetPayload.Token)

	if *u.PasswordToken != passwordTokenHash || u.PasswordTokenExpirationDate == nil || !pExp.After(now) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   "failed to reset password",
		})
	}

	u.Password = utils.HashPassword(passwordResetPayload.Password)
	u.PasswordToken = nil
	u.PasswordTokenExpirationDate = nil

	a.Save(ctx, u)

	return c.JSON(fiber.Map{
		"error": "false",
		"msg":   "Password reset successful",
	})
}
