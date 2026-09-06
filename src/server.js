const http = require("http");
const fs = require("fs");
const path = require("path");

const parentDir = path.dirname(__dirname);
const savedLocation = path.join(parentDir, "data", "todos.json");

const server = http.createServer((req, res) => {
  // ========== Server Init ==========
  if (req.url === "/" && req.method === "GET") {
    res.end("TODO application is running");
  }


});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server is listening on PORT: 5000");
});