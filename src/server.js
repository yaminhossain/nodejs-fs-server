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

  // ========== Post Request =====
  else if (req.url === "/todo" && req.method === "POST") {
    let apiData = "";
    req.on("data", (chunk) => {
      apiData += chunk;
    });

    req.on("end", () => {
      // read file from the storage
      const apiDataObj = JSON.parse(apiData);
      fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
        if (err || !data) {
          fs.writeFile(
            savedLocation,
            JSON.stringify([apiDataObj], null, 2),
            (err) => {
              console.log("Error Writing File", err);
            },
          );
        } else {
          const parsedData = JSON.parse(data);
          parsedData.push(apiDataObj);
          fs.writeFile(
            savedLocation,
            JSON.stringify(parsedData, null, 2),
            (err) => {
              console.log("Error Writing File", err);
            },
          );
        }
      });
      res.writeHead(200, "OK", { "content-type": "application/json" });
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
    });
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server is listening on PORT: 5000");
});
