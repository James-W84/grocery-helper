package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/James-W84/grocery-helper/backend/models"
	"github.com/James-W84/grocery-helper/backend/queries"
	"github.com/gorilla/mux"
)

func CreateStoreHandler(db *sql.DB) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {
		var store models.Store
		if err := json.NewDecoder(r.Body).Decode(&store); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		createdStore, err := queries.CreateStore(db, store.Name, store.UserID)

		if err != nil {
			http.Error(w, "Failed to create store", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(createdStore)
	}
}

type StoreIdPayload struct {
	StoreID int `json:"storeid"`
}

func GetStoreItemsHandler(db *sql.DB) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request) {

		vars := mux.Vars(r)
		storeIDStr := vars["store_id"]
		storeID, err := strconv.Atoi(storeIDStr)

		if err != nil {
			http.Error(w, "Invalid store ID", http.StatusBadRequest)
			return
		}

		items, err := queries.GetStoreItems(db, storeID)

		if err != nil {
			http.Error(w, "Failed to get store items", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(items)
	}
}