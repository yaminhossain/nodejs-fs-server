const fs = require("fs");
const path = require("path");

const addNewTodO = (req, res, savedLocation) => {
  console.log("Add New To Do Function is being called");
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
};

module.exports = addNewTodO;
