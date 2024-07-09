package store

import (
	"context"
	"fmt"

	"pkg/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB interface {
	Connect(config config.Config) error
	Save(ctx context.Context, data any) error
}

type DBClient struct {
	Client *gorm.DB
}

func NewDBClient(db *gorm.DB) *DBClient {
	return &DBClient{
		Client: db,
	}
}

func (dbc *DBClient) Save(ctx context.Context, data any) error {
	err := dbc.Client.WithContext(ctx).Save(data).Error
	if err != nil {
		return err
	}
	return nil
}

func (dbc *DBClient) Connect(config config.Config) error {
	dbConfig := config.Database
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", dbConfig.Host, dbConfig.User, dbConfig.Password, dbConfig.Name, dbConfig.Port)
	db, err := dbconnection(connStr)
	if err != nil {
		return err
	}
	dbc.Client = db
	return nil
}

func dbconnection(conn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(conn))
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (c *DBClient) AutoMigrate() {
	c.Client.AutoMigrate(&User{})
}

func GetDBClient() *DBClient {
	config := config.GetConfig()
	var db DBClient
	// todo: handle error
	_ = db.Connect(*config)
	return &db
}
