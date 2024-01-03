"use strict";

const { app } = require("./app");
const { PORT } = require("./config");

console.log(app);
app.listen(PORT, function () {
    console.log(`Started on http://localhost:${ PORT }`);
});

const { PrismaClient } = require('@prisma/client');
console.log("Prisma Client instantiated.");

module.exports = { PrismaClient };