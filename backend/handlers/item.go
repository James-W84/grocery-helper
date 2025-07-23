package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/James-W84/grocery-helper/backend/queries"
	"github.com/gorilla/mux"
)

type CreateItemPayload struct {
	Name string `json:"name"`
	Quantity int `json:"quantity"`
	StoreID int `json:"storeid"`
}

func CreateItemHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload CreateItemPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		createdItem, err := queries.CreateItem(db, payload.Name, payload.Quantity)

		if err != nil {
			http.Error(w, "Failed to create item", http.StatusInternalServerError)
			return
		}

		err = queries.AddItemToStore(db, payload.StoreID, createdItem.ID)

		if err != nil {
			http.Error(w, "Failed to add item to store", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(createdItem)
	}
}

func DeleteItemHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		itemIDStr := vars["item_id"]
		itemID, err := strconv.Atoi(itemIDStr)

		if err != nil {
			http.Error(w, "Invalid item ID", http.StatusBadRequest)
			return
		}

		if err := queries.DeleteItem(db, itemID); err != nil {
			http.Error(w, "Failed to delete item", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func PurchaseItemHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		itemIDStr := vars["item_id"]

		itemID, err := strconv.Atoi(itemIDStr)

		if err != nil {
			http.Error(w, "Invalid item ID", http.StatusBadRequest)
			return
		}

		if err := queries.PurchaseItem(db, itemID); err != nil {
			http.Error(w, "Failed to mark item as purchased", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func UnpurchaseItemHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		itemIDStr := vars["item_id"]

		itemID, err := strconv.Atoi(itemIDStr)

		if err != nil {
			http.Error(w, "Invalid item ID", http.StatusBadRequest)
			return
		}

		if err := queries.UnpurchaseItem(db, itemID); err != nil {
			http.Error(w, "Failed to mark item as unpurchased", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
