const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
var cors = require("cors");

const port = process.env.PORT || 8080;
const app = express();

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
// CORS
app.use(cors());
var corsOptions = {
  origin: function (origin, callback) {
    db.loadOrigins(function (error, origins) {
      callback(error, origins);
    });
  },
};
// app.get("/ping", function (req, res) {
//   return res.send("pong");
// });
app.get("api.tzstats.com", cors(corsOptions), function (req, res) {
  return res;
});

https: app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port);
