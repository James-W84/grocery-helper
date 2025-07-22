# Grocery Helper Backend

A Go-based REST API server for the Grocery Helper application. This backend provides data management and API endpoints for grocery shopping lists, items, stores, and user management.

## Features

- SQLite database for data persistence
- RESTful API endpoints
- User management
- Grocery item management
- Store management
- Automatic database table creation

## Prerequisites

- Go 1.24.5 or higher
- SQLite3 (included with Go sqlite3 driver)

## Project Structure

```
backend/
├── README.md           # This file
├── go.mod             # Go module definition
├── go.sum             # Go module checksums
├── server.go          # Main server entry point
├── dev_data.db        # SQLite database (created automatically)
├── models/
│   └── models.go      # Data models and structs
└── queries/
    └── db.go          # Database queries and table creation
```

## Setup and Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

The project uses Go modules, so dependencies will be automatically downloaded:

```bash
go mod download
```

### 3. Build the Application

```bash
go build -o server server.go
```

This creates a `server` executable in the current directory.

## Running the Server

### Development Mode

Run directly with Go:

```bash
go run server.go
```

### Production Mode

First build the application, then run the executable:

```bash
go build -o server server.go
./server
```

The server will start on `http://localhost:8080`

## Database

The application uses SQLite for data storage. The database file `dev_data.db` will be created automatically when you first run the server.

### Database Tables

The following tables are created automatically:

- **users**: User accounts with authentication
- **items**: Grocery items with quantity and purchase status
- **stores**: Store information linked to users
- **store_items**: Junction table linking stores and items

### Database File Location

- **Development**: `dev_data.db` in the backend directory
- The database file is excluded from version control (see `.gitignore`)

## API Endpoints

Currently available endpoints:

- `GET /` - List all database tables (for debugging)

## Configuration

### Environment Variables

The application currently uses hardcoded configuration. Future versions may support:

- `PORT` - Server port (default: 8080)
- `DB_PATH` - Database file path (default: dev_data.db)

## Development

### File Structure Explanation

- **server.go**: Main application entry point, HTTP server setup, and route handlers
- **models/models.go**: Go structs defining data models (User, Item, Store, StoreItem)
- **queries/db.go**: Database operations, table creation, and SQL queries
- **.gitignore**: Excludes build artifacts, databases, logs, and development files

### Ignored Files (.gitignore)

The following files and directories are excluded from version control:

- **Build artifacts**: `*.exe`, `*.out`, `*.test`, `bin/`, `vendor/`
- **Go modules**: `*.mod`, `*.sum` (auto-generated)
- **Database files**: `*.db` (including `dev_data.db`)
- **Logs and temporary files**: `*.log`, `*.bak`, `*.old`, `/tmp/`
- **Environment files**: `.env`, `.env.*`
- **Editor files**: `.DS_Store`, `.idea/`, `.vscode/`, `*.swp`
- **Binaries**: `main`, `server`, `backend`

### Adding New Features

1. **Database changes**: Modify `queries/db.go` to add new tables or queries
2. **Data models**: Add new structs to `models/models.go`
3. **API endpoints**: Add new handlers to `server.go`

## Troubleshooting

### Common Issues

1. **Port already in use**:

   - Change the port in `server.go` or kill the process using port 8080

   ```bash
   lsof -ti:8080 | xargs kill
   ```

2. **Database permission errors**:

   - Ensure write permissions in the backend directory
   - Delete `dev_data.db` to recreate with correct permissions

3. **Go module issues**:
   ```bash
   go mod tidy
   go mod download
   ```

### Logging

The server logs startup information and errors to stdout. Watch the console output for:

- Server startup confirmation
- Database connection status
- HTTP request errors

## Testing

Currently, the project doesn't include automated tests. To test the API:

1. Start the server
2. Visit `http://localhost:8080` to see the tables endpoint
3. Use tools like `curl`, Postman, or browser dev tools for API testing

Example:

```bash
curl http://localhost:8080
```

## Future Enhancements

- Add comprehensive API endpoints for CRUD operations
- Implement user authentication and authorization
- Add configuration file support
- Include automated testing
- Add API documentation (OpenAPI/Swagger)
- Implement proper logging with levels
- Add database migrations system

## Contributing

1. Make changes to the appropriate files
2. Test locally using `go run server.go`
3. Build and verify with `go build -o server server.go`
4. Ensure `.gitignore` patterns are respected
