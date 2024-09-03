package store

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"pkg/config"

	"github.com/redis/go-redis/v9"
)

type Redis[T any] struct {
	RC *redis.Client
}

func NewRedis[T any](rdb *redis.Client) *Redis[T] {
	return &Redis[T]{RC: rdb}
}

func (r *Redis[T]) Start(ctx context.Context, idemKey string) (T, bool, error) {
	var t T
	row := r.RC.HSetNX(ctx, "idem:"+idemKey, "status", "started")
	if row.Err() != nil {
		return t, false, row.Err()
	}

	if row.Val() {
		return t, false, nil
	}

	b, err := r.RC.HGet(ctx, "idem"+idemKey, "value").Bytes()
	if err != nil {
		return t, false, err
	}
	if err := json.Unmarshal(b, &t); err != nil {
		return t, false, err
	}

	return t, true, nil
}

func (r *Redis[T]) Store(ctx context.Context, idemKey string, value T) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.RC.HSet(ctx, "idem:"+idemKey, "value", b).Err()
}

func RedisConn(config *config.Config) (*redis.Client, error) {
	rConfig := config.Cache
	redisUrl := fmt.Sprintf("%s:%s", rConfig.Host, rConfig.Port)
	redisDb, err := strconv.Atoi(rConfig.DbNo)
	if err != nil {
		return nil, err
	}

	options := &redis.Options{
		Addr:     redisUrl,
		Password: rConfig.Password,
		DB:       redisDb,
	}

	redisClient := redis.NewClient(options)

	return redisClient, nil
}
