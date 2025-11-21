# Bookfair Stall Management System - Backend

Microservices-based backend for managing book fair stalls, reservations, and notifications.

## Prerequisites

- Docker & Docker Compose
- Node.js 18+

## Quick Start

```bash
# 1. Start all services
npm run docker:dev

# 2. Initialize database (first time only)
npm run db:init

# 3. Seed with sample data
npm run db:seed
```

**Services running at:**
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Stall Service: http://localhost:3002
- Reservation Service: http://localhost:3003
- Notification Service: http://localhost:3004

## Test Credentials

After seeding, login with:

```
Admin:     admin@bookfair.com / Admin@123
Employee:  employee@bookfair.com / Employee@123
Vendor:    vendor1@example.com / Vendor@123
Publisher: publisher1@example.com / Publisher@123
```

## Available Commands

### Docker
```bash
npm run docker:dev    # Start all services
npm run docker:logs   # View logs
npm run docker:down   # Stop services
```

### Database
```bash
npm run db:init     # Initialize database
npm run db:seed     # Seed sample data
npm run db:clear    # Clear all data
npm run db:reset    # Clear and reseed
npm run db:status   # Check status
```

## Quick API Test

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor1@example.com","password":"Vendor@123"}'

# Get stalls (use accessToken from login response)
curl http://localhost:3000/api/stalls?status=available \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Seed Data Details

The `npm run db:seed` command creates:

- **5 Users:** Admin, Employee, 2 Vendors, 1 Publisher
- **3 Categories:** Books, Stationery, Arts & Crafts
- **120 Stalls:** 
  - 3 zones (A, B, C)
  - 2 floors per zone
  - Sizes: 100-200 sqft
  - Prices: 1,000-2,000 LKR/day
  - Various amenities (WiFi, Power, Display Shelf, etc.)

## Troubleshooting

**Services won't start:**
```bash
npm run docker:down
npm run docker:dev
```

**Database connection issues:**
```bash
docker ps                 # Check if MongoDB is running
npm run db:status         # Verify connection
```

**View service logs:**
```bash
npm run docker:logs
```

**Reset everything:**
```bash
npm run docker:down
npm run docker:dev
npm run db:init
npm run db:seed
```
