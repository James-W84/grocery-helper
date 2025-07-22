package main

import (
	"database/sql"

	"github.com/James-W84/grocery-helper/backend/handlers"
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/user", handlers.CreateUserHandler(db)).Methods("POST")
	router.HandleFunc("/login", handlers.LoginUserHandler(db)).Methods("POST")
}