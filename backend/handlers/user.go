package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/James-W84/grocery-helper/backend/models"
	"github.com/James-W84/grocery-helper/backend/queries"
	"github.com/gorilla/mux"
)


func CreateUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		createdUser, err := queries.CreateUser(db, user.Username, user.Password)

		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(createdUser)
	}
}

func LoginUserHandler(db *sql.DB) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		var user models.User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		loginUser, err := queries.ValidateUserLogin(db, user.Username, user.Password)

		if err != nil {
			if errors.Is(err, queries.ErrInvalidCredentials) {
				http.Error(w, "Invalid username or password", http.StatusUnauthorized)
				return
			}
			log.Println("Unexpected error:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(loginUser)
	}
}

func GetUserStoresHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		userIDStr := vars["user_id"]

		userID, err := strconv.Atoi(userIDStr)

		if err != nil {
			http.Error(w, "Invalid store ID", http.StatusBadRequest)
			return
		}

		stores, err := queries.GetStoresByUserID(db, userID)

		if err != nil {
			http.Error(w, "Error getting stores", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(stores)
	}
}