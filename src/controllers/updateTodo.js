const fs = require("fs");

const updateTodo = (req, res, id, savedLocation) => {
  let data = "";
  // Reading Data from request body
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    let parsedApiData;

    try {
      parsedApiData = JSON.parse(data);
    } catch (error) {
      res.writeHead(400, "Bad Request", {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "error",
          message: "Invalid JSON format",
        }),
      );

      return;
    }

    const { set = {}, upsert = false } = parsedApiData;

    const isUpcomingDataValid = isValidUpdateInput(set, upsert);

    if (!isUpcomingDataValid) {
      res.writeHead(400, "Bad Request", {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "error",
          message: "Invalid update data",
        }),
      );

      return;
    }

    fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
      if (err) {
        res.writeHead(500, "Internal Server error", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "Internal Server Error",
          }),
        );
        return;
      }
      if (!data) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "No Data available",
          }),
        );
        return;
      }

      // ======= Todos exist =========
      const parsedTodos = JSON.parse(data);
      const matchedTodo = parsedTodos.find(
        (todo) => Number(todo.id) === Number(id),
      );

      if (matchedTodo && isUpcomingDataValid) {
        for (let key in set) {
          matchedTodo[key] = set[key];
        }
        const newTodos = JSON.stringify(parsedTodos, null, 2);
        fs.writeFile(savedLocation, newTodos, (err) => {
          if (err) {
            res.writeHead(500, "Internal Server Error", {
              "content-type": "application/json",
            });
            res.end(
              JSON.stringify({
                status: "error",
                message: `Error updating data for id: ${id}`,
              }),
            );
            return;
          }

          res.writeHead(200, "OK", { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              status: "OK",
              message: `Data updated for id: ${id}`,
            }),
          );
        });
        return;
      }

      if (!matchedTodo && upsert && isUpcomingDataValid) {
        const newSet = { id: Number(id), ...set };
        parsedTodos.push(newSet);
        const newTodos = JSON.stringify(parsedTodos, null, 2);

        fs.writeFile(savedLocation, newTodos, (err) => {
          if (err) {
            res.writeHead(500, "Internal server error", {
              "content-type": "application/json",
            });
            res.end(
              JSON.stringify({
                status: "error",
                message: "Something went wrong on the server side",
              }),
            );
            return;
          }
          res.writeHead(200, "OK", {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "ok",
              message: "new entry added",
            }),
          );
        });
        return;
      }

      if (!matchedTodo && !upsert && isUpcomingDataValid) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "Todo Not Found",
          }),
        );
        return;
      }

      // ======= If no cases matched =========
      res.writeHead(500, "Internal Server Error", {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "Something went wrong",
        }),
      );
    });
  });
};

module.exports = updateTodo;

function isPlainObject(val) {
  return (
    val !== null &&
    typeof val === "object" &&
    Object.getPrototypeOf(val) === Object.prototype
  );
}

function isValidUpdateInput(set, upsert) {
  return isPlainObject(set) && typeof upsert === "boolean";
}
