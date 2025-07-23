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
	router.HandleFunc("/unpurchase/{item_id}", handlers.UnpurchaseItemHandler(db)).Methods("GET")
	router.HandleFunc("/stores/{user_id}", handlers.GetUserStoresHandler(db)).Methods("GET")
	router.HandleFunc("/item/{item_id}", handlers.DeleteItemHandler(db)).Methods("DELETE")
}