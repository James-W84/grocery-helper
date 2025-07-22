package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/James-W84/grocery-helper/backend/queries"
	_ "github.com/mattn/go-sqlite3"
)


func main() {
	db, err := sql.Open("sqlite3", "dev_data.db")

	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	if err := queries.CreateTables(db); err != nil {
		log.Fatal("Table creation failed:", err)
	}

	http.HandleFunc("/", ListTablesHandlers(db))

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func ListTablesHandlers(db *sql.DB) http.HandlerFunc { 
	return func(w http.ResponseWriter, r *http.Request) {
		tables, err := listTables(db)
		if err != nil {
			http.Error(w, "Failed to fetch tables", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tables)
	}
}

func listTables(db *sql.DB) ([]string, error) {
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
