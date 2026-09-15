const fs = require("fs");

const getSingleTodo = (req, res, savedLocation, id) => {
  fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
    if (err || !data) {
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

    const parsedObj = JSON.parse(data);
    const matchedTodo = parsedObj.find(
      (todo) => Number(todo.id) === Number(id),
    );

    if (matchedTodo) {
      res.writeHead(200, "OK", {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "OK",
          data: matchedTodo,
        }),
      );
    }
  });
};

module.exports = getSingleTodo;
