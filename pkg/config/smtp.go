package config

import "pkg/utils"

type smtpConfig struct {
	Username string
	Password string
	Port     string
	Host     string
	From     string
}

func setSmtpConfig() *smtpConfig {
	var sm smtpConfig
	utils.MustMapEnv(&sm.Username, "SMTP_USERNAME")
	utils.MustMapEnv(&sm.Password, "SMTP_PASSWORD")
	utils.MustMapEnv(&sm.Port, "SMTP_PORT")
	utils.MustMapEnv(&sm.Host, "SMTP_HOST")
	utils.MustMapEnv(&sm.From, "SMTP_FROM")

	return &sm
}

// smtp.PlainAuth("", username, password, smtpost)
// from := "amsoea@gmaog"
// to := []string{"emrekw@"}
// message := []byte("to: skfjdskfjkdsfjk")
// smtpUrl := smtpHost + ":587"

// err := smtp.SendMail(smtpUrl, auth, from, to, message)
