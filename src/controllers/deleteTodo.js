const fs = require("fs");

const deleteTodo = (req, res, id, savedLocation) => {
  fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
    if (err || !data) {
      res.writeHead(404, "Not Found", {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "No data found",
        }),
      );
      return;
    }

    const parsedObj = JSON.parse(data);
    const remainingTodo = parsedObj.filter(
      (todo) => parseInt(todo.id) !== parseInt(id),
    );
    console.log("Remaining Todo=====>", remainingTodo);

    // remaining todo ==> []
    // remaining todo ==> [{id} , {id}]

    if (remainingTodo.length) {
      const newTodo = JSON.stringify(remainingTodo, null, 2);
      fs.writeFile(savedLocation, newTodo, (err) => {
        if (err) {
          res.writeHead(500, "Internal Server Error", {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "error",
              message: "Internal Server",
            }),
          );
        }

        res.writeHead(200, "OK", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "OK",
            message: "Deleted Successfully",
          }),
        );
      });
    } else {
      fs.unlink(savedLocation, (err) => {
        if (err) {
          res.writeHead(500, "Internal Server Error", {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "error",
              message: "Delete was Unsuccessful",
            }),
          );
        }

        res.writeHead(200, "OK", { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: "OK",
            message: "Deleted Successfully",
          }),
        );
      });
    }
  });
};

module.exports = deleteTodo;
