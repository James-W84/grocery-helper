package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/James-W84/grocery-helper/backend/queries"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
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

	router := mux.NewRouter()

	router.HandleFunc("/tables", ListTablesHandler(db)).Methods("GET")
	RegisterRoutes(router, db)

	routerCORS := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // or ["*"] for all
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(router)


	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", routerCORS))
}

func ListTablesHandler(db *sql.DB) http.HandlerFunc { 
	return func(w http.ResponseWriter, r *http.Request) {
		tables, err := queries.ListTables(db)
		if err != nil {
			http.Error(w, "Failed to fetch tables", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tables)
	}
}

