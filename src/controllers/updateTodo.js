const fs = require("fs");

const updateTodo = (req, res, id, savedLocation) => {
  console.log(" ===========Update Function Hit======== ");

  let data = "";
  // Reading Data from request body
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const parsedApiData = JSON.parse(data);
    const { set = {}, upsert = false } = parsedApiData;

    // Reading file
    fs.readFile(savedLocation, { encoding: "utf8" }, (err, data) => {
      if (err || !data) {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "Nothing to update",
          }),
        );
        return;
      }

      const parsedObj = JSON.parse(data);
      const matchedTodo = parsedObj.find(
        (obj) => Number(obj.id) === Number(id),
      );

      // Test Case 01
      if (
        matchedTodo &&
        upsert &&
        typeof upsert === "boolean" &&
        // set instanceof Object
        // typeof set === "object"
        isPlainObject(set)
      ) {
        for (let key in set) {
          matchedTodo[key] = set[key];
        }
        // console.log("Stringified New data ===>", JSON.stringify(parsedObj));

        fs.writeFile(
          savedLocation,
          JSON.stringify(parsedObj, null, 2),
          (err) => {
            if (err) {
              res.writeHead(500, "Internal Server Error", {
                "content-type": "application/json",
              });

              res.end(
                JSON.stringify({
                  status: "error",
                  message: "server error",
                }),
              );
              return;
            }
            // Response For matched data
            res.writeHead(200, "OK", {
              "content-type": "application/json",
            });
            res.end(
              JSON.stringify({
                status: "OK",
                message: "আপডেট করেছি ",
              }),
            );
            return;
          },
        );
      }

      // Test Case 02
      else if (
        matchedTodo &&
        !upsert &&
        typeof upsert === "boolean" &&
        // upsert instanceof Boolean &&
        // typeof set === "object"
        isPlainObject(set)
      ) {
        const setKeys = Object.keys(set);
        const matchedTodoKeys = Object.keys(matchedTodo);
        const temp = [];
        setKeys.forEach((key) => {
          matchedTodoKeys.forEach((mKey) => {
            // if(key in matchedKeys)
            if (key === mKey) {
              temp.push(key);
            }
          });
        });

        temp.forEach((key) => {
          matchedTodo[key] = set[key];
        });

        // console.log("Parsed Object After Update =======>", parsedObj);

        const updatedTodo = JSON.stringify(parsedObj, null, 2);

        fs.writeFile(savedLocation, updatedTodo, (err) => {
          if (err) {
            res.writeHead(500, "Internal Server Error", {
              "content-type": "application/json",
            });

            res.end(
              JSON.stringify({
                status: "error",
                message: "server error",
              }),
            );
            return;
          }

          // Response For matched data
          res.writeHead(200, "OK", {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "OK",
              message: "আপডেট করেছি ",
            }),
          );
          return;
        });
      } else {
        res.writeHead(404, "Not Found", {
          "content-type": "application/json",
        });
        res.end(
          JSON.stringify({
            status: "error",
            message: "Nothing to update",
          }),
        );
        return;
      }
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
