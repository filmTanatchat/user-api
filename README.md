<!-- @format -->

# User Management API with Auth & RBAC

A complete RESTful API built with Node.js, Express, and MySQL, featuring authentication with JWT, password hashing using bcrypt, and Role-Based Access Control (RBAC).

---

## Features

- User registration (`/signup`) with password hashing
- User login (`/login`) with JWT generation
- Protected routes requiring token authentication
- Role-based access control (admin/user)
- User CRUD operations with validation
- Error handling, filtering, pagination, and sorting
- Bulk user creation

---

## Tech Stack

- Node.js
- Express
- MySQL (via mysql2)
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/filmTanatchat/user-api.git
cd user-api
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=user_management
JWT_SECRET=your_secure_key
```

### 3. Run the Server

```bash
node server.js
```

> Server runs at `http://localhost:3000`

---

## API Specification

### Auth Routes

#### POST /signup

Register a new user

**Request Body**:

```json
{
  "name": "Alice",
  "email": "alice@mail.com",
  "password": "123456",
  "age": 25,
  "role": "admin" // optional, default = user
}
```

**Response**:

```json
{
  "message": "User registered",
  "userId": 1
}
```

#### POST /login

Authenticate user and return JWT

**Request Body**:

```json
{
  "email": "alice@mail.com",
  "password": "123456"
}
```

**Response**:

```json
{
  "token": "<JWT_TOKEN>"
}
```

---

### User Routes (Require JWT)

Use header:

```http
Authorization: Bearer <token>
```

#### GET /users/me

Get your own user profile

#### GET /users/admin

Admin-only route

#### POST /users

Create new user

#### GET /users

List users with optional filters:

- `?name=John`
- `?email=example@mail.com`
- `?age=25`
- `?page=1&limit=10`
- `?sort=name&order=asc`

#### GET /users/:id

Get user by ID

#### PUT /users/:id

Update user

#### DELETE /users/:id

Delete user

#### POST /users/bulk-users

Add multiple users at once

```json
[
  { "name": "A", "email": "a@mail.com", "age": 20 },
  { "name": "B", "email": "b@mail.com", "age": 21 }
]
```

---

## Error Handling

- 400: Bad Request (validation or duplicate)
- 401: Unauthorized (no token or invalid)
- 403: Forbidden (wrong role)
- 404: Route not found
- 500: Internal server error

---

## License

MIT

---

## Author

Tanatchat Film (@filmTanatchat)

---

## Deployment

> Deploy online preview: Coming soon (will be hosted on Render / Railway)
