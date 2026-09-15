const fs = require("fs");

const getAllTodos = (req, res, savedLocation) => {
  fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
    if (err || !data) {
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
};

module.exports = getAllTodos;
