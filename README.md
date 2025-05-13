# Auth Service

A simple authentication service built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, supporting user signup and login with JWT-based authentication.

---

## 🚀 Features

- User Signup with hashed passwords
- Secure Login with JWT tokens
- Role-based access control (coming soon)
- PostgreSQL database via Prisma ORM
- Environment configuration with `.env`
- Security via Helmet and CORS

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Token (JWT)
- bcrypt for password hashing

## Prisma Setup
npx prisma migrate dev --name init
npx prisma generate

## Run Locally
npx nodemon src/index.js
The server will run at: http://localhost:5000

