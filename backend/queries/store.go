package queries

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/James-W84/grocery-helper/backend/models"
)

// CreateStore creates a new store for a user
func CreateStore(db *sql.DB, name string, userID int) (*models.Store, error) {
	// Validate that the user exists
	var exists int
	err := db.QueryRow("SELECT id FROM users WHERE id = ?", userID).Scan(&exists)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("error validating user: %v", err)
	}

	// Insert the new store
	result, err := db.Exec("INSERT INTO stores (name, user_id) VALUES (?, ?)", name, userID)
	if err != nil {
		return nil, fmt.Errorf("error creating store: %v", err)
	}

	// Get the inserted store ID
	storeID, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("error getting store ID: %v", err)
	}

	// Return the created store
	store := &models.Store{
		ID:     int(storeID),
		Name:   name,
		UserID: userID,
	}

	return store, nil
}

// GetStoresByUserID retrieves all stores for a specific user
func GetStoresByUserID(db *sql.DB, userID int) ([]models.Store, error) {
	rows, err := db.Query("SELECT id, name, user_id FROM stores WHERE user_id = ?", userID)
	if err != nil {
		return nil, fmt.Errorf("error querying stores: %v", err)
	}
	defer rows.Close()

	var stores []models.Store
	for rows.Next() {
		var store models.Store
		err := rows.Scan(&store.ID, &store.Name, &store.UserID)
		if err != nil {
			return nil, fmt.Errorf("error scanning store: %v", err)
		}
		stores = append(stores, store)
	}

	return stores, nil
}

// GetStoreByID retrieves a store by its ID
func GetStoreByID(db *sql.DB, storeID int) (*models.Store, error) {
	var store models.Store

	err := db.QueryRow("SELECT id, name, user_id FROM stores WHERE id = ?", storeID).Scan(
		&store.ID, &store.Name, &store.UserID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("store not found")
		}
		return nil, fmt.Errorf("error querying store: %v", err)
	}

	return &store, nil
}

// UpdateStore updates a store's name
func UpdateStore(db *sql.DB, storeID int, name string, userID int) error {
	// Verify the store belongs to the user
	var existingUserID int
	err := db.QueryRow("SELECT user_id FROM stores WHERE id = ?", storeID).Scan(&existingUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("store not found")
		}
		return fmt.Errorf("error checking store: %v", err)
	}

	if existingUserID != userID {
		return errors.New("unauthorized: store does not belong to user")
	}

	// Update the store
	result, err := db.Exec("UPDATE stores SET name = ? WHERE id = ?", name, storeID)
	if err != nil {
		return fmt.Errorf("error updating store: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return errors.New("store not found")
	}

	return nil
}

// DeleteStore deletes a store and all associated store_items
func DeleteStore(db *sql.DB, storeID int, userID int) error {
	// Verify the store belongs to the user
	var existingUserID int
	err := db.QueryRow("SELECT user_id FROM stores WHERE id = ?", storeID).Scan(&existingUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("store not found")
		}
		return fmt.Errorf("error checking store: %v", err)
	}

	if existingUserID != userID {
		return errors.New("unauthorized: store does not belong to user")
	}

	// Delete the store (CASCADE will handle store_items)
	result, err := db.Exec("DELETE FROM stores WHERE id = ?", storeID)
	if err != nil {
		return fmt.Errorf("error deleting store: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return errors.New("store not found")
	}

	return nil
}


// GetStoreItems retrieves all items in a store
func GetStoreItems(db *sql.DB, storeID int) ([]models.Item, error) {
	query := `
		SELECT i.id, i.name, i.quantity, i.purchased, i.created
		FROM items i
		INNER JOIN store_items si ON i.id = si.item_id
		WHERE si.store_id = ?
		ORDER BY i.created
	`

	rows, err := db.Query(query, storeID)
	if err != nil {
		return nil, fmt.Errorf("error querying store items: %v", err)
	}
	defer rows.Close()

	var items []models.Item
	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Name, &item.Quantity, &item.Purchased, &item.Created)
		if err != nil {
			return nil, fmt.Errorf("error scanning item: %v", err)
		}
		items = append(items, item)
	}

	return items, nil
}
