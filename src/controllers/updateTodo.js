const fs = require("fs");

const updateTodo = (req, res, id, savedLocation) => {
  console.log(" ############ Update Function Hit ############ ");

  let data = "";
  // Reading Data from request body
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    const parsedApiData = JSON.parse(data);
    const { set = {}, upsert = false } = parsedApiData;
    const sanitized = isSanitized(set, upsert);

    console.log("Is Set and Upsert sanitized:::::::", sanitized);
    // set object must contain some properties
    if (Object.keys(set).length === 0) {
      res.writeHead(405, "Not Allowed", {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: "error",
          message: "set object must contain some properties",
        }),
      );
      return;
    } else {
      // Reading file
      fs.readFile(savedLocation, { encoding: "utf8" }, (err, fileData) => {
        // File doesn't exist or no data inside the file
        if (err || !fileData) {
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

        // -------------------- If data exist -------------------
        const parsedObj = JSON.parse(fileData);
        const matchedTodo = parsedObj.find(
          (obj) => Number(obj.id) === Number(id),
        );

        if (upsert && !matchedTodo && sanitized) {
          set.id = id;
          parsedObj.push(set);
          const updatedTodo = JSON.stringify(parsedObj, null, 2);
          fs.writeFile(savedLocation, updatedTodo, (err) => {
            if (err) {
              res.writeHead(500, "Internal Server Error", {
                "content-type": "application/json",
              });
              res.end(
                JSON.stringify({
                  status: "error",
                  message:
                    "Although upsert: false, matchedTodo: false and data sanitized, something went wrong",
                }),
              );
              return;
            }
            res.writeHead(200, "OK", { "content-type": "application/json" });
            res.end(
              JSON.stringify({
                status: "OK",
                message: `Successfully updated data for id${id}`,
              }),
            );
          });
          return;
        }

        if (!upsert && !matchedTodo && sanitized) {
          res.writeHead(404, "Not Found", {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              status: "error",
              message: `Id: ${id} did not matched`,
            }),
          );
          return;
        }

        if (matchedTodo && sanitized) {
          const setKeys = Object.keys(set);
          const matchedObjKeys = Object.keys(matchedTodo);
          const temp = [];

          setKeys.forEach((sk) =>
            matchedObjKeys.forEach((mk) => mk === sk && temp.push(sk)),
          );

          temp.forEach((tk) => (matchedTodo[tk] = set[tk]));

          const updatedTodo = JSON.stringify(parsedObj, null, 2);
          fs.writeFile(savedLocation, updatedTodo, (err) => {
            if (err) {
              res.writeHead(500, "Internal server error", {
                "content-type": "application/json",
              });
              res.end(
                JSON.stringify({
                  status: "error",
                  message: "Something went wrong",
                }),
              );
              return;
            }

            res.writeHead(200, "OK", { "content-type": "application/json" });
            res.end(
              JSON.stringify({
                status: "OK",
                message: `Successfully updated data for ${id}`,
              }),
            );
          });
          return;
        }

        // Ultimate failure
        res.writeHead(403, "Forbidden", { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            message: "Please enter valid data",
          }),
        );
      });
    }
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

function isSanitized(set, upsert) {
  return isPlainObject(set) && typeof upsert === "boolean";
}
