package services

import (
	"fmt"
	"net/smtp"

	"pkg/config"
)

type EmailService struct {
	To      []string
	Message []byte
}

func NewEmailService(to []string, message []byte) *EmailService {
	return &EmailService{
		To:      to,
		Message: message,
	}
}

func (es *EmailService) Send() error {
	config := config.GetConfig().SMTP
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	url := fmt.Sprintf("%s:%s", config.Host, config.Port)
	from := config.From

	err := smtp.SendMail(url, auth, from, es.To, es.Message)
	if err != nil {
		return err
	}

	return nil
}

type VerificationEmail struct {
	Name              string
	Email             string
	VerificationToken string
}

func NewVerificationEmail(name, email, verificationToken string) *VerificationEmail {
	return &VerificationEmail{
		Name:              name,
		Email:             email,
		VerificationToken: verificationToken,
	}
}

func (ve *VerificationEmail) SendVerificationEmail() error {
	message := fmt.Sprintf(`
	<h4>Hi %s</h4>,
	<p> Welcome to Doctors Corner </p>
    <p>To verify your email address and complete your registration, please verify your email address by entering the following verifcation code: %s</p>
	<p>If you did not initiate this request, please ignore this email</p>
    <p>Thanks,</p>
    <p>The ASAP Team</p>
	`, ve.Name, ve.VerificationToken)

	config := config.GetConfig().SMTP
	subject := "Email Confirmation"
	from := config.From
	to := []string{ve.Email}

	msg := []byte(
		fmt.Sprintf(
			`
			To: %s\r\n
			From: %s\r\n
			Subject: %s\r\n
			\r\n
			%s
			`, to, from, subject, message,
		),
	)

	es := NewEmailService(to, msg)

	return es.Send()
}

type ResetPasswordEmail struct {
	Name   string
	Email  string
	Token  string
	Origin string
}

func NewResetPasswordEmail(name, email, token, origin string) *ResetPasswordEmail {
	return &ResetPasswordEmail{
		Name:   name,
		Email:  email,
		Token:  token,
		Origin: origin,
	}
}

func (rpe *ResetPasswordEmail) SendResetPasswordEmail() error {
	resetUrl := fmt.Sprintf("%s/user/reset-password?token=%s&email=%s", rpe.Origin, rpe.Token, rpe.Email)
	message := fmt.Sprintf(`
	<h4>Hello %s</h4>,
    <p>We received a request to reset your password.</p>
    <p>To reset your password, please click the link: <a href="%s">Reset Password</a></p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>Thanks,</p>
    <p>The ASAP Team</p>
	`, rpe.Name, resetUrl)

	config := config.GetConfig().SMTP
	subject := "Reset Password"
	from := config.From
	to := []string{rpe.Email}

	msg := []byte(
		fmt.Sprintf(
			`
			To: %s\r\n
			From: %s\r\n
			Subject: %s\r\n
			\r\n
			%s
			`, to, from, subject, message,
		),
	)

	es := NewEmailService(to, msg)
	return es.Send()
}
