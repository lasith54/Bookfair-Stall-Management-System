# Reservation Service API Documentation

Base URL: `http://localhost:3000/api` (via API Gateway)

## Endpoints

### 1. Create Reservation

```bash
POST http://localhost:3000/api/reservations
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "stallId": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "purpose": "Book sale and author signing event for new releases",
  "specialRequests": "Need extra electrical outlets for lighting"
}
```

**Note:** Requires authentication (vendor or publisher role). Duration cannot exceed 30 days.

**Response (201):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "reservationNumber": "RES-2025-0001",
      "userId": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "John Publisher",
        "email": "john@example.com",
        "contactNumber": "+94771234567"
      },
      "stallId": {
        "_id": "507f1f77bcf86cd799439011",
        "stallNumber": "A-101",
        "location": {
          "zone": "Hall A",
          "floor": "Ground Floor"
        },
        "pricing": {
          "basePrice": 10000,
          "currency": "LKR"
        }
      },
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-05T00:00:00.000Z",
      "duration": 4,
      "basePrice": 10000,
      "totalAmount": 40000,
      "remainingAmount": 40000,
      "paidAmount": 0,
      "paymentStatus": "pending",
      "status": "pending",
      "purpose": "Book sale and author signing event for new releases",
      "specialRequests": "Need extra electrical outlets for lighting",
      "submittedAt": "2025-11-18T10:00:00.000Z",
      "createdAt": "2025-11-18T10:00:00.000Z",
      "updatedAt": "2025-11-18T10:00:00.000Z"
    }
  }
}
```

---

### 2. Get My Reservations

```bash
GET http://localhost:3000/api/reservations/my-reservations?status=approved&page=1&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status: pending, approved, rejected, confirmed, cancelled, completed
- `paymentStatus` - Filter by payment status: pending, partial, paid, refunded
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc or desc (default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "reservationNumber": "RES-2025-0001",
        "stallId": {
          "stallNumber": "A-101",
          "location": {
            "zone": "Hall A",
            "floor": "Ground Floor"
          }
        },
        "status": "approved",
        "paymentStatus": "partial",
        "totalAmount": 40000,
        "paidAmount": 20000,
        "remainingAmount": 20000,
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-05T00:00:00.000Z",
        "createdAt": "2025-11-18T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

---

### 3. Get Reservation by ID

```bash
GET http://localhost:3000/api/reservations/507f1f77bcf86cd799439012
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "reservationNumber": "RES-2025-0001",
      "userId": {
        "name": "John Publisher",
        "email": "john@example.com",
        "contactNumber": "+94771234567"
      },
      "stallId": {
        "stallNumber": "A-101",
        "location": {
          "zone": "Hall A",
          "floor": "Ground Floor",
          "section": "North Wing"
        },
        "pricing": {
          "basePrice": 10000,
          "currency": "LKR"
        },
        "amenities": ["WiFi", "Power Supply"],
        "features": {
          "hasElectricity": true,
          "hasWifi": true
        }
      },
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-05T00:00:00.000Z",
      "duration": 4,
      "basePrice": 10000,
      "totalAmount": 40000,
      "status": "approved",
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@bookfair.com"
      },
      "approvedAt": "2025-11-19T14:30:00.000Z",
      "paymentDeadline": "2025-11-26T14:30:00.000Z"
    },
    "timeline": [
      {
        "action": "Created",
        "date": "2025-11-18T10:00:00.000Z",
        "status": "completed"
      },
      {
        "action": "Approved",
        "date": "2025-11-19T14:30:00.000Z",
        "status": "completed"
      }
    ]
  }
}
```

---

### 4. Cancel Reservation

```bash
POST http://localhost:3000/api/reservations/507f1f77bcf86cd799439012/cancel
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "Unable to participate due to scheduling conflict with another event"
}
```

**Note:** Refund policy - 30+ days: 90%, 14-30 days: 50%, 7-14 days: 25%, <7 days: 0%

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "reservationNumber": "RES-2025-0001",
      "status": "cancelled",
      "cancelledAt": "2025-11-20T09:00:00.000Z",
      "cancellationReason": "Unable to participate due to scheduling conflict with another event"
    },
    "refundAmount": 18000,
    "refundPercentage": 90
  }
}
```

---

### 5. Check Stall Availability

```bash
POST http://localhost:3000/api/reservations/check-availability
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "stallId": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "conflictingReservations": []
  }
}
```

**Response (200)** - if not available:
```json
{
  "success": true,
  "data": {
    "isAvailable": false,
    "conflictingReservations": [
      {
        "reservationNumber": "RES-2025-0005",
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-03T00:00:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

---

## Admin Endpoints

### 6. Get All Reservations (Admin)

```bash
GET http://localhost:3000/api/reservations/admin/all?status=pending&page=1&limit=20
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `page`, `limit` - Pagination (default: 1, 10)
- `status` - Filter by status: pending, approved, rejected, confirmed, cancelled, completed
- `paymentStatus` - Filter by payment status: pending, partial, paid, refunded
- `userId` - Filter by user ID
- `stallId` - Filter by stall ID
- `startDate`, `endDate` - Filter by date range
- `search` - Search by reservation number
- `sortBy`, `sortOrder` - Sorting options

**Note:** Requires Admin or Employee role.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reservations": [...],
    "statistics": {
      "total": 150,
      "pending": 25,
      "approved": 80,
      "rejected": 10,
      "confirmed": 30,
      "cancelled": 5,
      "totalRevenue": 5000000,
      "totalPaid": 3500000
    },
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

### 7. Approve Reservation (Admin)

```bash
POST http://localhost:3000/api/reservations/admin/507f1f77bcf86cd799439012/approve
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "notes": "Approved for premium location",
  "discount": {
    "type": "percentage",
    "value": 10,
    "reason": "Early bird discount"
  },
  "paymentDeadline": "2025-11-25"
}
```

**Note:** Requires Admin or Employee role. All fields are optional.

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation approved successfully",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "reservationNumber": "RES-2025-0001",
      "status": "approved",
      "discount": {
        "type": "percentage",
        "value": 10,
        "reason": "Early bird discount"
      },
      "totalAmount": 36000,
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@bookfair.com"
      },
      "approvedAt": "2025-11-19T14:30:00.000Z",
      "paymentDeadline": "2025-11-25T00:00:00.000Z",
      "notes": "Approved for premium location"
    }
  }
}
```

---

### 8. Reject Reservation (Admin)

```bash
POST http://localhost:3000/api/reservations/admin/507f1f77bcf86cd799439012/reject
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "Stall is reserved for organizing committee use during this period"
}
```

**Note:** Requires Admin or Employee role.

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation rejected",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "reservationNumber": "RES-2025-0001",
      "status": "rejected",
      "rejectionReason": "Stall is reserved for organizing committee use during this period"
    }
  }
}
```

---

### 9. Update Reservation (Admin)

```bash
PUT http://localhost:3000/api/reservations/admin/507f1f77bcf86cd799439012
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "confirmed",
  "additionalCharges": [
    {
      "description": "Extra electricity connection",
      "amount": 5000
    },
    {
      "description": "Storage space rental",
      "amount": 3000
    }
  ],
  "notes": "Special setup required for lighting equipment",
  "paymentStatus": "partial",
  "paidAmount": 25000
}
```

**Note:** Requires Admin or Employee role. All fields are optional.

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation updated successfully",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "totalAmount": 48000,
      "additionalCharges": [
        {
          "description": "Extra electricity connection",
          "amount": 5000
        },
        {
          "description": "Storage space rental",
          "amount": 3000
        }
      ],
      "paidAmount": 25000,
      "remainingAmount": 23000
    }
  }
}
```

---

### 10. Confirm Reservation (Admin)

```bash
POST http://localhost:3000/api/reservations/admin/507f1f77bcf86cd799439012/confirm
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "notes": "All requirements met, setup confirmed"
}
```

**Note:** Requires Admin or Employee role. Only approved reservations with payment can be confirmed.

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation confirmed successfully",
  "data": {
    "reservation": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "confirmed",
      "notes": "All requirements met, setup confirmed"
    }
  }
}
```

---

### 11. Generate Report (Admin)

```bash
GET http://localhost:3000/api/reservations/admin/reports/generate?startDate=2025-01-01&endDate=2025-12-31&groupBy=status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `startDate` - Start date for report (optional)
- `endDate` - End date for report (optional)
- `groupBy` - Group by: status or paymentStatus (default: status)

**Note:** Requires Admin or Employee role.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalReservations": 150,
      "totalRevenue": 5000000,
      "totalPaid": 3500000,
      "averageBookingValue": 33333
    },
    "breakdown": [
      {
        "_id": "approved",
        "count": 80,
        "totalAmount": 2800000,
        "paidAmount": 2000000
      },
      {
        "_id": "confirmed",
        "count": 30,
        "totalAmount": 1200000,
        "paidAmount": 1200000
      },
      {
        "_id": "pending",
        "count": 25,
        "totalAmount": 800000,
        "paidAmount": 200000
      }
    ],
    "filters": {
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "groupBy": "status"
    }
  }
}
```

---

## Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]  // Optional validation errors
}
```

### Common HTTP Status Codes

- `200 OK` - Successful GET, PUT, POST operations
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation errors or business logic violations
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., stall not available)
- `500 Internal Server Error` - Server error

---

## Business Rules

### Reservation Status Flow

```
pending → approved → confirmed → completed
    ↓         ↓          ↓
  rejected  cancelled  cancelled
```

### Payment Status Flow

```
pending → partial → paid
    ↓         ↓       ↓
 refunded  refunded refunded
```

### Key Rules

1. **Duration**: Maximum 30 days per reservation
2. **Date Validation**: Start date must be in the future
3. **Availability**: No overlapping reservations for same stall
4. **Approval**: Only pending reservations can be approved/rejected
5. **Confirmation**: Only approved reservations with payment can be confirmed
6. **Cancellation**: Cannot cancel completed reservations
7. **Refund**: Based on cancellation timing (see refund policy)

---

## Testing

### Health Check

```bash
GET http://localhost:3003/health
```

Response:
```json
{
  "success": true,
  "message": "Reservation service is running",
  "timestamp": "2025-11-18T10:00:00.000Z"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are in LKR (Sri Lankan Rupees)
- Reservation numbers are auto-generated (format: `RES-YYYY-NNNN`)
- Maximum reservation duration: 30 days
- Payment deadline: 7 days from approval (default)
- Refund policy applies based on cancellation timing
- `duration` and `remainingAmount` are auto-calculated fields
