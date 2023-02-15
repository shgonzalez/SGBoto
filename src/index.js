//require = require("esm")(module /*, options*/);
//require("dotenv").config({ path: __dirname + "/.env" });
//module.exports = require("./app.js");
// 
import config from "./config.js"

console.log(config.jiraHostname)

import app from "./app.js"

