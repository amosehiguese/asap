package store

import (
	"time"

	"pkg/auth"
	"pkg/repo"
	"pkg/utils"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	repo.BaseModel
	FirstName                   string     `gorm:"size:255;not null" json:"firstname" validate:"required"`
	LastName                    *string    `gorm:"size:255" json:"lastname,omitempty" validate:"lte=255"`
	Email                       string     `gorm:"uniqueIndex;not null" json:"email" validate:"required,email,lte=255"`
	Password                    string     `gorm:"size:255;not null" json:"-" validate:"required,lte=255"`
	Role                        auth.Role  `gorm:"size:25;not null" json:"role" validate:"required,lte=25"`
	Verified                    *time.Time `json:"verified,omitempty"`
	IsVerified                  bool       `gorm:"default:false" json:"is_verified"`
	VerificationToken           string     `gorm:"size:255" json:"-" validate:"required,lte=255"`
	PasswordToken               *string    `gorm:"size:255" json:"-"`
	PasswordTokenExpirationDate *time.Time `json:"password_token_expiration_date,omitempty"`
	NotificationEnabled         bool       `gorm:"default:false" json:"notification_enabled"`
	LastSeen                    time.Time  `json:"last_seen,omitempty"`
	Profile                     Profile    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"profile"`
	ProfileID                   string
}

func (u *User) TableName() string {
	return "users"
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.ID = uuid.New().String()
	hashedPwd := utils.HashPassword(u.Password)
	tx.Statement.SetColumn("password", hashedPwd)
	return nil
}

func (u *User) ComparePasswordHash(inputPwd string) bool {
	userPassword := utils.NormalizePassword(u.Password)
	inputPassword := utils.NormalizePassword(inputPwd)

	if err := bcrypt.CompareHashAndPassword(userPassword, inputPassword); err != nil {
		return false
	}
	return true

}
