const http = require("http");
const fs = require("fs");
const path = require("path");

const parentDir = path.dirname(__dirname);
const savedLocation = path.join(parentDir, "data", "todos.json");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlParts = url.pathname.split("/");

  // ========== Server Init ==========
  if (req.url === "/" && req.method === "GET") {
    res.end("TODO application is running");
  }

  // ========== Post a Single todo =====
  else if (req.url === "/todo" && req.method === "POST") {
    let apiData = "";
    req.on("data", (chunk) => {
      apiData += chunk;
    });

    req.on("end", () => {
      // read file from the storage
      const apiDataObj = JSON.parse(apiData);
      // handling non-existence folder error
      fs.mkdir(path.dirname(savedLocation), { recursive: true }, (err) => {
        if (err) {
          console.log("There was an error while creating the directory:", err);
          return;
        }
        fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
          if (err || !data) {
            fs.writeFile(
              savedLocation,
              JSON.stringify([apiDataObj], null, 2),
              (err) => {
                if (err) {
                  console.log("Error Writing File", err);
                  return;
                }

                // response headers
                res.writeHead(200, "OK", {
                  "content-type": "application/json",
                });
                res.end(
                  JSON.stringify(
                    {
                      status: "OK",
                      data: apiDataObj,
                    },
                    null,
                    2,
                  ),
                );
              },
            );
          } else {
            const parsedData = JSON.parse(data);
            parsedData.push(apiDataObj);
            fs.writeFile(
              savedLocation,
              JSON.stringify(parsedData, null, 2),
              (err) => {
                if (err) {
                  console.log("Error Writing File", err);
                  return;
                }

                // response headers
                res.writeHead(200, "OK", {
                  "content-type": "application/json",
                });
                res.end(
                  JSON.stringify(
                    {
                      status: "OK",
                      data: apiDataObj,
                    },
                    null,
                    2,
                  ),
                );
              },
            );
          }
        });
      });
    });
  }

  // =========== Get all todos =========
  else if (req.url === "/todos" && req.method === "GET") {
    fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
      if (err && !data) {
        res.writeHead(500, "Internal Server Error", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message:
              "An unexpected error occurred while fetching your todos. Please try again later.",
          }),
        );

        return;
      }

      const parsedObj = JSON.parse(data);
      res.writeHead(200, "OK", {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "OK",
          data: parsedObj,
        }),
      );
    });
  }

  // ========== Get a single ToDo using route params ============
  // "/todo/id"
  else if (req.method === "GET" && urlParts[1] === "todos" && urlParts[2]) {
    const id = urlParts[2];
    fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
      console.log("Reading Data");
      if (err && !data) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "no data found",
          }),
        );
        return;
      }

      const parsedObj = JSON.parse(data)
      console.log(parsedObj)
      const matchedTodo = parsedObj.find(obj => obj.id === id)
      console.log(matchedTodo)

      res.end()
    });
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server is listening on PORT: 5000");
});
