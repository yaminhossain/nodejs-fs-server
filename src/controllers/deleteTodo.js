const fs = require("fs");

const deleteTodo = (req, res, id, savedLocation) => {
  console.log("ID::::::::::::::::", id);
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
    }

    const parsedObj = JSON.parse(data);
    const remainingTodo = parsedObj.filter(
      (todo) => parseInt(todo.id) !== parseInt(id),
    );
    console.log("Remaining Todo=====>", remainingTodo);

    if(remainingTodo){
      
    }

    res.end();
  });
};

module.exports = deleteTodo;
