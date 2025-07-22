package main

import (
	"database/sql"

	"github.com/James-W84/grocery-helper/backend/handlers"
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/user", handlers.CreateUserHandler(db)).Methods("POST")
	router.HandleFunc("/login", handlers.LoginUserHandler(db)).Methods("POST")
	router.HandleFunc("/store", handlers.CreateStoreHandler(db)).Methods("POST")
	router.HandleFunc("/stores/{store_id}/items", handlers.GetStoreItemsHandler(db)).Methods("GET")
	router.HandleFunc("/item", handlers.CreateItemHandler(db)).Methods("POST")
	router.HandleFunc("/purchase/{item_id}", handlers.PurchaseItemHandler(db)).Methods("GET")
}