package models

import "time"

type User struct {
	ID int `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Item struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Quantity int `json:"quantity"`
	Purchased bool `json:"purchased"`
	Created time.Time `json:"created"`
}

type Store struct {
	ID int `json:"id"`
	Name string `json:"name"`
	UserID int `json:"userid"`
}

type StoreItem struct {
	ID int `json:"id"`
	ItemID int `json:"itemid"`
	StoreID int `json:"storeid"`
}