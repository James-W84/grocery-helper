package queries

import (
	"database/sql"
	"log"
)

func CreateTables(db *sql.DB) error {
	createUserTable := `
		CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`

	createItemTable := `
	CREATE TABLE IF NOT EXISTS items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		quantity INTEGER NOT NULL,
		purchased BOOLEAN NOT NULL DEFAULT 0,
		created DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	createStoreTable := `
	CREATE TABLE IF NOT EXISTS stores (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		user_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);`

	createStoreItemTable := `
	CREATE TABLE IF NOT EXISTS store_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		item_id INTEGER NOT NULL,
		store_id INTEGER NOT NULL,
		FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
		FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
		UNIQUE(store_id, item_id)
	);`

	tables := []string{createUserTable, createItemTable, createStoreTable, createStoreItemTable}

	for _, stmt := range tables {
		_, err := db.Exec(stmt)
		if err != nil {
			log.Println("Table creation failed:", err)
			return err
		}
	}

	return nil
}

func ListTables(db *sql.DB) ([]string, error) {
	rows, err := db.Query(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		tables = append(tables, name)
	}
	return tables, nil
}
