# Bookfair Stall Management System

Complete microservices-based system for managing the Colombo International Book Fair stall reservations with separate customer and admin portals.

## System Architecture

- **Backend**: 5 microservices (Auth, Stall, Reservation, Notification, API Gateway)
- **Frontend**: Customer portal for vendors/publishers
- **Admin Frontend**: Management dashboard for admins/employees
- **Database**: MongoDB 7.0

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### 1. Start All Services
```bash
docker compose up --build
```

### 2. Initialize Database
```bash
cd backend
npm run db:init
npm run db:seed
```

## Access URLs

- **Customer Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:5174
- **API Gateway**: http://localhost:3000

## Test Credentials

```
Admin:     admin@bookfair.com / Admin@123
Employee:  employee@bookfair.com / Employee@123
Vendor:    vendor@example.com / Vendor@123
Publisher: publisher@example.com / Publisher@123
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Database |
| API Gateway | 3000 | Routes requests |
| Auth Service | 3001 | Authentication |
| Stall Service | 3002 | Stall management |
| Reservation Service | 3003 | Bookings |
| Notification Service | 3004 | Email & QR codes |
| Customer Frontend | 5173 | Vendor portal |
| Admin Frontend | 5174 | Admin dashboard |

## Features

### Customer Portal
- Browse 88 stalls on interactive SVG map
- Reserve stalls with genre selection
- View personal reservations
- Download QR codes

### Admin Portal
- User management (CRUD)
- Stall status overview
- Reservation monitoring
- Dashboard analytics

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Docker

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Nginx

## Development

### Backend Only
```bash
cd backend
npm run docker:dev
```

### Frontend Only
```bash
# Customer
cd frontend
npm run dev

# Admin
cd admin-frontend
npm run dev
```

## Database Commands

```bash
cd backend
npm run db:init      # Initialize
npm run db:seed      # Seed data
npm run db:clear     # Clear all
npm run db:reset     # Clear & reseed
npm run db:status    # Check status
```

## Project Structure

```
Bookfair Stall Management System/
├── backend/
│   ├── services/
│   │   ├── api-gateway/
│   │   ├── auth-service/
│   │   ├── stall-service/
│   │   ├── reservation-service/
│   │   └── notification-service/
│   └── scripts/
├── frontend/              # Customer portal
├── admin-frontend/        # Admin dashboard
└── docker-compose.yml
```
