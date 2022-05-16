require("dotenv").config();
const express = require("express");
const app = express();
const main = require("./main");

main(app);