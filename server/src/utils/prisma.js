const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Export the Prisma instance using CommonJS syntax
module.exports = prisma;
