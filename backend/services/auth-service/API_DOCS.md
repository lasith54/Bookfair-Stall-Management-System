# Auth Service API Documentation

Base URL: `http://localhost:3000/api/auth` (via API Gateway)

## Endpoints

### 1. Register User (Vendor/Publisher)

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "Password@123",
  "name": "John Doe",
  "businessName": "ABC Bookstore",
  "contactNumber": "+94771234567", 
  "address": "123 Main St, Colombo",
  "role": "vendor"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "vendor@example.com",
      "name": "John Doe",
      "role": "vendor"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login (Vendor/Publisher)

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "Password@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "vendor@example.com",
      "name": "John Doe",
      "role": "vendor"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Employee Login

```bash
POST http://localhost:3000/api/auth/employee/login
Content-Type: application/json

{
  "email": "employee@bookfair.com",
  "password": "Employee@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employee login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "employee@bookfair.com",
      "name": "Admin User",
      "role": "employee"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Profile (Protected)

```bash
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "vendor@example.com",
      "name": "John Doe",
      "businessName": "ABC Bookstore",
      "contactNumber": "+94771234567",
      "address": "123 Main St, Colombo",
      "role": "vendor",
      "isVerified": true,
      "createdAt": "2025-11-06T10:30:00.000Z"
    }
  }
}
```

---

### 5. Refresh Token

```bash
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6. Logout

```bash
POST http://localhost:3000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 7. Verify Token (Protected)

```bash
GET http://localhost:3000/api/auth/verify
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "vendor@example.com",
      "name": "John Doe",
      "role": "vendor"
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Token Expired (401)
```json
{
  "success": false,
  "message": "Token expired"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied: Insufficient permissions"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 failed attempts per 15 minutes

---

## User Roles

- `vendor` - Book vendors
- `publisher` - Book publishers
- `employee` - Event staff
- `admin` - System administrators

---
