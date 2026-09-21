const http = require("http");
const path = require("path");

const addNewTodO = require("./controllers/addNewToDo");
const getAllTodos = require("./controllers/getAllTodos");
const getSingleTodo = require("./controllers/getSingleTodo");
const deleteTodo = require("./controllers/deleteTodo");
const updateTodo = require("./controllers/updateTodo");

const parentDir = path.dirname(__dirname);
const savedLocation = path.join(parentDir, "data", "todos.json");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlParts = url.pathname.split("/");

  console.log(
    "======================== Server's been hit =====================",
  );

  // ========== Server Init ==========
  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("TODO application is running");
  }

  // ========== Create a TODO ==========
  else if (url.pathname === "/todo" && req.method === "POST") {
    addNewTodO(req, res, savedLocation);
  }

  // ========== Get all TODOs ==========
  else if (url.pathname === "/todos" && req.method === "GET") {
    getAllTodos(req, res, savedLocation);
  }

  // ========== Get a single TODO ==========
  else if (req.method === "GET" && urlParts[1] === "todos" && urlParts[2]) {
    const id = urlParts[2];
    getSingleTodo(req, res, savedLocation, id);
  }

  // ========== Delete a TODO ==========
  else if (
    req.method === "DELETE" &&
    url.pathname === "/todos" &&
    url.searchParams.has("id")
  ) {
    const id = url.searchParams.get("id");
    deleteTodo(req, res, id, savedLocation);
  }

  // ========== Update a TODO ==========
  else if (req.method === "PATCH" && urlParts[1] === "todos" && urlParts[2]) {
    updateTodo(req, res, urlParts[2], savedLocation);
  }

  // ========== Route not found ==========
  else {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        status: "error",
        message: "Route not found",
      }),
    );
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server is listening on PORT: 5000");
});
