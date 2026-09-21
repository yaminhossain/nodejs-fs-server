# TODO Application — Raw Node.js

A simple TODO REST API built with **raw Node.js**, using the built-in `http`, `fs`, and `path` modules.

The application stores TODO data in a local JSON file.

## Features

- Create a TODO
- Get all TODOs
- Get a single TODO by ID
- Update a TODO using `PATCH`
- Delete a TODO using a query parameter
- Support for MongoDB-like `$set` and `upsert` behavior
- JSON-file-based data storage

## Project Structure

```text
project/
├── data/
│   └── todos.json
├── src/
│   ├── controllers/
│   │   ├── addNewToDo.js
│   │   ├── deleteTodo.js
│   │   ├── getAllTodos.js
│   │   ├── getSingleTodo.js
│   │   └── updateTodo.js
│   └── server.js
├── package.json
└── README.md
```

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Running the Application

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server runs at:

```text
http://127.0.0.1:5000
```

You can also try:

```text
http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check whether the server is running |
| POST | `/todo` | Create a new TODO |
| GET | `/todos` | Get all TODOs |
| GET | `/todos/:id` | Get a single TODO |
| PATCH | `/todos/:id` | Update a TODO |
| DELETE | `/todos?id=:id` | Delete a TODO |

## Example TODO Data

The `todos.json` file may contain data like this:

```json
[
  {
    "id": 1,
    "title": "Learning Backend",
    "description": "Using Node.js",
    "keywords": ["node", "backend", "javascript"],
    "completed": false,
    "priority": "high"
  },
  {
    "id": 2,
    "title": "Build REST API",
    "description": "Create a TODO API using raw Node.js",
    "keywords": ["node", "http", "rest-api"],
    "completed": true,
    "priority": "medium"
  }
]
```

## Testing with Postman

You can use **Postman** to test the API.

### 1. Check Server Status

- Method: `GET`
- URL: `http://127.0.0.1:5000/`

### 2. Create a TODO

- Method: `POST`
- URL: `http://127.0.0.1:5000/todo`
- Body: `raw` → `JSON`

Example request body:

```json
{
  "title": "Learn Node.js",
  "description": "Build a TODO API",
  "keywords": ["node", "backend"],
  "completed": false,
  "priority": "high"
}
```

### 3. Get All TODOs

- Method: `GET`
- URL: `http://127.0.0.1:5000/todos`

### 4. Get a Single TODO

- Method: `GET`
- URL: `http://127.0.0.1:5000/todos/1`

### 5. Update a TODO

- Method: `PATCH`
- URL: `http://127.0.0.1:5000/todos/1`
- Body: `raw` → `JSON`

Example request body:

```json
{
  "set": {
    "description": "Updated description",
    "completed": true
  },
  "upsert": false
}
```

The `set` object contains the fields to update.

- `"upsert": false`: Return `404` if the TODO does not exist.
- `"upsert": true`: Create a new TODO if the requested ID does not exist.

Example upsert request:

```json
{
  "set": {
    "title": "New TODO",
    "description": "Created using upsert",
    "keywords": ["node", "api"],
    "completed": false,
    "priority": "medium"
  },
  "upsert": true
}
```

### 6. Delete a TODO

- Method: `DELETE`
- URL: `http://127.0.0.1:5000/todos?id=1`

## HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200` | Request completed successfully |
| `400` | Invalid request data or invalid JSON |
| `404` | TODO or route not found |
| `500` | Internal server error |

## Available npm Scripts

| Script | Command | Description |
|---|---|---|
| `npm start` | `node src/server.js` | Start the server |
| `npm run dev` | `npx nodemon src/server.js` | Start the server with Nodemon |

## Notes

- This project uses a local JSON file instead of a database.
- The server is built with Node.js's native `http` module.
- Make sure the server is running before sending requests from Postman.
- Request bodies must contain valid JSON.
- JSON property names and string values must use double quotes.

## License

This project is for learning and practice purposes.
