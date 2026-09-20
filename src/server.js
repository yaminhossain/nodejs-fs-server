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
  console.log("======================== Server's been hit =====================")

  // ========== Server Init ==========
  if (req.url === "/" && req.method === "GET") {
    res.end("TODO application is running");
  }

  // ========== Post a Single todo =====
  else if (req.url === "/todo" && req.method === "POST") {
    addNewTodO(req, res, savedLocation);
  }

  // =========== Get all todos =========
  else if (req.url === "/todos" && req.method === "GET") {
    getAllTodos(req, res, savedLocation);
  }

  // ========== Get a single ToDo using route params ============
  else if (req.method === "GET" && urlParts[1] === "todos" && urlParts[2]) {
    const id = urlParts[2];
    getSingleTodo(req, res, savedLocation, id);
  }

  // ============== Delete a single Todo using search params==============
  else if (
    req.url === "/todos" &&
    req.method === "DELETE" &&
    url.searchParams
  ) {
    const id = url.searchParams.get("id");
    deleteTodo(req, res, id, savedLocation);
  }

  // ============ PUT Operation: Update single todo data ==============
  else if (req.url === `/todos/${urlParts[2]}` && req.method === "PATCH") {
    updateTodo(req, res, urlParts[2], savedLocation);
  }

  // res.end();
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server is listening on PORT: 5000");
});
