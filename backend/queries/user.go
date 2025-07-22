package queries

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/James-W84/grocery-helper/backend/models"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidCredentials = errors.New("invalid username or password")

// CreateUser creates a new user with hashed password
func CreateUser(db *sql.DB, username, password string) (*models.User, error) {
	// Check if username already exists
	var existingID int
	err := db.QueryRow("SELECT id FROM users WHERE username = ?", username).Scan(&existingID)
	if err == nil {
		return nil, errors.New("username already exists")
	}
	if err != sql.ErrNoRows {
		return nil, fmt.Errorf("error checking username: %v", err)
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %v", err)
	}

	// Insert the new user
	result, err := db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", username, string(hashedPassword))
	if err != nil {
		return nil, fmt.Errorf("error creating user: %v", err)
	}

	// Get the inserted user ID
	userID, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("error getting user ID: %v", err)
	}

	// Return the created user (without password)
	user := &models.User{
		ID:       int(userID),
		Username: username,
		Password: "", // Don't return the hashed password
	}

	return user, nil
}

// ValidateUserLogin validates user credentials and returns the user if valid
func ValidateUserLogin(db *sql.DB, username, password string) (*models.User, error) {
	var user models.User
	var hashedPassword string

	// Get user by username
	err := db.QueryRow("SELECT id, username, password FROM users WHERE username = ?", username).Scan(
		&user.ID, &user.Username, &hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrInvalidCredentials
		}
		return nil, fmt.Errorf("error querying user: %v", err)
	}

	// Compare password with hash
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Don't return the password in the user object
	user.Password = ""
	return &user, nil
}

// GetUserByID retrieves a user by their ID
func GetUserByID(db *sql.DB, userID int) (*models.User, error) {
	var user models.User

	err := db.QueryRow("SELECT id, username FROM users WHERE id = ?", userID).Scan(
		&user.ID, &user.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("error querying user: %v", err)
	}

	return &user, nil
}

// GetUserByUsername retrieves a user by their username
func GetUserByUsername(db *sql.DB, username string) (*models.User, error) {
	var user models.User

	err := db.QueryRow("SELECT id, username FROM users WHERE username = ?", username).Scan(
		&user.ID, &user.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("error querying user: %v", err)
	}

	return &user, nil
}

