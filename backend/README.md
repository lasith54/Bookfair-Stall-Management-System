# Bookfair Stall Management System - Backend

Microservices backend for stall management using Node.js, Express, and MongoDB.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for running scripts outside Docker)

### Start Services

```bash
# Start all services
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

Services will be available at:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- MongoDB: localhost:27017

### Initialize Database

```bash
# Create collections and indexes
# Run the seed script (creates default accounts)
npm run db:init

# Check database status
npm run db:status
```

### Test Credentials

```
Admin:     admin@bookfair.com / Admin@123
Employee:  employee@bookfair.com / Employee@123
Vendor:    vendor@example.com / Vendor@123
Publisher: publisher@example.com / Publisher@123
```

## API Usage

### Register User
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "John Doe",
  "businessName": "ABC Books",
  "contactNumber": "+94771234567",
  "address": "123 Main St, Colombo",
  "role": "vendor"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "Vendor@123"
}
```

### Get Profile (Protected)
```bash
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Architecture

**Microservices:**
- **API Gateway** (3000) - Request routing & rate limiting
- **Auth Service** (3001) - Authentication & user management
- **Stall Service** (3002) - Stall management
- **Reservation Service** (3003) - Booking management
- **Notification Service** (3004) - Email notifications

**Shared Database:** All services use a single MongoDB database (`bookfair`)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile (Protected)

## Environment Variables

## Available Commands

```bash
# Docker
npm run docker:dev           # Start services
npm run docker:down          # Stop services
npm run docker:logs          # View all logs
npm run docker:restart       # Restart services

# Database
npm run db:init              # Initialize database
npm run db:status            # View database status

## Project Structure

```
backend/
├── services/
│   ├── api-gateway/         # Request routing (Port 3000)
│   ├── auth-service/        # Authentication (Port 3001)
│   ├── stall-service/       # Stall management (Port 3002)
│   ├── reservation-service/ # Reservations (Port 3003)
│   └── notification-service/# Notifications (Port 3004)
├── shared/                  # Shared utilities
└── scripts/                 # Database scripts
```

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB 7.0
- **Authentication:** JWT
- **Containerization:** Docker & Docker Compose
