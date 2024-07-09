package user_api

import (
	"context"

	"asap/store"

	"github.com/google/uuid"
)

type IUser interface {
	Create(ctx context.Context, body *store.User) (*store.User, error)
	Update(ctx context.Context, id uuid.UUID, body *store.User) (*store.User, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetAllUsers(ctx context.Context, filter map[string]any, sortBy []string, limit int, page int) ([]*store.User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*store.User, error)
	GetByEmail(ctx context.Context, email string) (*store.User, error)
}

type UserRepo struct {
	allowedSortByFields   []string
	allowedFilterByFields []string
}

func NewUserRepo() IUser {
	var user IUser = &UserRepo{
		allowedSortByFields: []string{
			"Name",
			"CreatedAt",
			"UpdatedAt",
		},
		allowedFilterByFields: []string{
			"Name",
			"Role",
			"IsVerified",
		},
	}
	return user
}

// Ensures that UserRepo implements User
var _ IUser = (*UserRepo)(nil)

func (u *UserRepo) Create(ctx context.Context, body *store.User) (*store.User, error) {
	c := store.GetDBClient()
	result := c.Client.WithContext(ctx).Create(&body)
	if result.Error != nil {
		return nil, result.Error
	}
	return body, nil
}

func (u *UserRepo) Update(ctx context.Context, id uuid.UUID, body *store.User) (*store.User, error) {
	c := store.GetDBClient()
	c.Client.WithContext(ctx).Model(&store.User{}).Where("ID=?", id).Updates(body)
	return body, nil
}

func (u *UserRepo) Delete(ctx context.Context, id uuid.UUID) error {
	c := store.GetDBClient()
	c.Client.Delete(&store.User{}, id)
	return nil
}

func (u *UserRepo) GetAllUsers(ctx context.Context, filter map[string]any, sortBy []string, limit int, page int) ([]*store.User, error) {
	return []*store.User{}, nil
}

func (u *UserRepo) GetByID(ctx context.Context, id uuid.UUID) (*store.User, error) {
	return u.by(ctx, "id", id)
}

func (u *UserRepo) GetByEmail(ctx context.Context, email string) (*store.User, error) {
	return u.by(ctx, "email", email)
}

func (u *UserRepo) by(ctx context.Context, key string, value any) (*store.User, error) {
	c := store.GetDBClient()
	var user store.User
	if row := c.Client.WithContext(ctx).Where(key+"=?", value).First(&user); row.Error != nil {
		return nil, row.Error
	}

	return &user, nil
}
