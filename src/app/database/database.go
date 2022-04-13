package database

import (
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() (*gorm.DB, error) {
	// Password should be set as EVN variable rather than hardcoded value
	dsn := "host=localhost user=postgres password=iceprincess dbname=web port=5432 sslmode=disable TimeZone=US/Pacific"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.WithError(err).Error("Failed to connect to database.")
		return nil, err
	}

	if !db.Migrator().HasTable(&User{}) {
		if err := db.AutoMigrate(&User{}); err != nil {
			log.WithError(err).Error("Failed to initiate Users table.")
			return nil, err
		}
	}
	if !db.Migrator().HasTable(&Item{}) {
		if err := db.AutoMigrate(&Item{}); err != nil {
			log.WithError(err).Error("Failed to initiate Items table.")
			return nil, err
		}
	}

	return db, nil
}
