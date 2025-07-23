package queries

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/James-W84/grocery-helper/backend/models"
)

func CreateItem(db *sql.DB, name string, quantity int) (*models.Item, error) {
	result, err := db.Exec("INSERT INTO items (name, quantity) VALUES (?, ?)", name, quantity)

	if err != nil {
		return nil, fmt.Errorf("error creating item: %v", err)
	}

	itemId, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("error getting item ID: %v", err)
	}

	// Return the created item
	item := &models.Item{
		ID:     int(itemId),
		Name:   name,
		Quantity: quantity,
		Purchased: false,
		Created: time.Now(),
	}

	return item, nil
}

func DeleteItem(db *sql.DB, itemID int) error {
	result, err := db.Exec("DELETE FROM items WHERE id = ?", itemID)

	if err != nil {
		return fmt.Errorf("error deleting item: %v", err)
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		return errors.New("item not found")
	}

	return nil
}

// AddItemToStore adds an item to a store
func AddItemToStore(db *sql.DB, storeID, itemID int) error {
	// Check if the store exists
	var exists int
	err := db.QueryRow("SELECT id FROM stores WHERE id = ?", storeID).Scan(&exists)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("store not found")
		}
		return fmt.Errorf("error checking store: %v", err)
	}

	// Check if the item exists
	err = db.QueryRow("SELECT id FROM items WHERE id = ?", itemID).Scan(&exists)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("item not found")
		}
		return fmt.Errorf("error checking item: %v", err)
	}

	// Insert the store-item relationship (UNIQUE constraint will prevent duplicates)
	_, err = db.Exec("INSERT INTO store_items (store_id, item_id) VALUES (?, ?)", storeID, itemID)
	if err != nil {
		return fmt.Errorf("error adding item to store: %v", err)
	}

	return nil
}

// RemoveItemFromStore removes an item from a store
func RemoveItemFromStore(db *sql.DB, storeID, itemID int) error {
	result, err := db.Exec("DELETE FROM store_items WHERE store_id = ? AND item_id = ?", storeID, itemID)
	if err != nil {
		return fmt.Errorf("error removing item from store: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return errors.New("item not found in store")
	}

	return nil
}

func PurchaseItem(db *sql.DB, itemId int) (error) {
	result, err := db.Exec("UPDATE items SET purchased = 1 WHERE id = ?", itemId)

	if err != nil {
		return fmt.Errorf("error marking item as purchased: %v", err)
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		return fmt.Errorf("no such item found")
	}

	return nil
}

func UnpurchaseItem(db *sql.DB, itemId int) (error) {
	result, err := db.Exec("UPDATE items SET purchased = 0 WHERE id = ?", itemId)

	if err != nil {
		return fmt.Errorf("error marking item as purchased: %v", err)
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		return fmt.Errorf("no such item found")
	}

	return nil
}