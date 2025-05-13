const { PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
// This file is used to create a Prisma client instance that can be used to interact with the database.
// It imports the PrismaClient from the @prisma/client package and creates a new instance of it.