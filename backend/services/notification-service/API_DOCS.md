# Notification Service API Documentation

Base URL: `http://localhost:3004/api`

## Endpoints

### 1. Get My Notifications

```bash
GET http://localhost:3004/api/notifications?page=1&limit=20&read=false&type=RESERVATION_CREATED
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `read` - Filter by read status: true, false
- `type` - Filter by notification type: RESERVATION_CREATED, RESERVATION_APPROVED, RESERVATION_REJECTED, RESERVATION_CONFIRMED, PAYMENT_REMINDER, RESERVATION_REMINDER, RESERVATION_CANCELLED, QR_CODE_SENT

**Response (200):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "_id": "notification_id",
        "type": "RESERVATION_CREATED",
        "subject": "Reservation Created Successfully",
        "message": "Your reservation has been created",
        "status": "SENT",
        "read": false,
        "reservation": {
          "reservationNumber": "RES-2025-0001",
          "stall": "stall_id",
          "startDate": "2025-02-01",
          "endDate": "2025-02-05",
          "totalAmount": 40000,
          "status": "PENDING"
        },
        "sentAt": "2025-01-15T10:30:00Z",
        "createdAt": "2025-01-15T10:25:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20
    },
    "unreadCount": 12
  }
}
```

---

### 2. Get Notification by ID

```bash
GET http://localhost:3004/api/notifications/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "RESERVATION_APPROVED",
    "subject": "Reservation Approved",
    "message": "Your reservation has been approved",
    "status": "SENT",
    "read": false,
    "reservation": {
      "reservationNumber": "RES-2025-0001",
      "stall": {
        "name": "Premium Stall A1"
      },
      "startDate": "2025-02-01",
      "endDate": "2025-02-05"
    },
    "metadata": {
      "discount": 10,
      "adminNotes": "Approved with early bird discount"
    },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 3. Get Unread Count

```bash
GET http://localhost:3004/api/notifications/unread-count
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unreadCount": 5
  }
}
```

---

### 4. Mark Notification as Read

```bash
PUT http://localhost:3004/api/notifications/507f1f77bcf86cd799439011/read
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "read": true,
    "readAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### 5. Mark All as Read

```bash
PUT http://localhost:3004/api/notifications/mark-all-read
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 6. Resend Notification

```bash
POST http://localhost:3004/api/notifications/507f1f77bcf86cd799439011/resend
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification resent successfully",
  "data": {
    "success": true,
    "messageId": "<email_message_id>"
  }
}
```

---

### 7. Delete Notification

```bash
DELETE http://localhost:3004/api/notifications/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### 8. Get My Preferences

```bash
GET http://localhost:3004/api/preferences
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences retrieved successfully",
  "data": {
    "_id": "preference_id",
    "user": "user_id",
    "email": {
      "enabled": true,
      "reservationCreated": true,
      "reservationApproved": true,
      "reservationRejected": true,
      "reservationConfirmed": true,
      "paymentReminder": true,
      "reservationReminder": true,
      "reservationCancelled": true,
      "qrCodeSent": true
    },
    "sms": {
      "enabled": false,
      "reservationApproved": false,
      "reservationReminder": false
    },
    "push": {
      "enabled": true,
      "reservationCreated": true,
      "reservationApproved": true,
      "paymentReminder": true
    },
    "language": "en",
    "timezone": "Asia/Colombo"
  }
}
```

---

### 9. Update Preferences

```bash
PUT http://localhost:3004/api/preferences
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "email": {
    "enabled": true,
    "paymentReminder": false
  },
  "language": "en",
  "timezone": "Asia/Colombo"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "_id": "preference_id",
    "email": {
      "enabled": true,
      "paymentReminder": false
    },
    "language": "en",
    "timezone": "Asia/Colombo"
  }
}
```

---

### 10. Reset Preferences

```bash
POST http://localhost:3004/api/preferences/reset
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences reset to default",
  "data": {
    "_id": "preference_id",
    "email": {
      "enabled": true,
      "reservationCreated": true
    }
  }
}
```

---

### 11. Get My QR Code

```bash
GET http://localhost:3004/api/qrcodes/reservation/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "QR code retrieved successfully",
  "data": {
    "_id": "qrcode_id",
    "reservation": "507f1f77bcf86cd799439011",
    "user": "user_id",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "metadata": {
      "reservationNumber": "RES-2025-0001",
      "stallName": "Premium Stall A1",
      "startDate": "2025-02-01",
      "endDate": "2025-02-05",
      "totalAmount": 36000
    },
    "isScanned": false,
    "isValid": true,
    "validUntil": "2025-02-05",
    "expiresAt": "2025-02-12",
    "createdAt": "2025-01-15T12:00:00Z"
  }
}
```

---

### 12. Generate QR Code (Protected)

```bash
POST http://localhost:3004/api/qrcodes/generate/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note:** Only works for CONFIRMED reservations.

**Response (201):**
```json
{
  "success": true,
  "message": "QR code generated successfully",
  "data": {
    "_id": "qrcode_id",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "metadata": {
      "reservationNumber": "RES-2025-0001"
    },
    "isValid": true,
    "expiresAt": "2025-02-12"
  }
}
```

---

### 13. Regenerate QR Code (Protected)

```bash
POST http://localhost:3004/api/qrcodes/regenerate/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note:** Invalidates the old QR code and generates a new one.

**Response (200):**
```json
{
  "success": true,
  "message": "QR code regenerated successfully",
  "data": {
    "_id": "new_qrcode_id",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
  }
}
```

---

### 14. Verify QR Code

```bash
POST http://localhost:3004/api/qrcodes/verify
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "qrData": "encrypted_qr_data_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "QR code verified",
  "data": {
    "valid": true,
    "qrCodeRecord": {
      "_id": "qrcode_id",
      "isValid": true,
      "isScanned": false
    },
    "decodedData": {
      "reservationNumber": "RES-2025-0001",
      "userEmail": "user@example.com"
    }
  }
}
```

---

### 15. Get All Notifications (Admin)

```bash
GET http://localhost:3004/api/admin/notifications?page=1&limit=20&status=SENT&type=RESERVATION_CREATED&recipient=691c5e662c7ef6c8c61199df
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status: PENDING, SENT, FAILED, DELIVERED, BOUNCED
- `type` - Filter by notification type
- `recipient` - Filter by recipient user ID

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    },
    "statistics": {
      "pending": 5,
      "sent": 120,
      "failed": 3
    }
  }
}
```

---

### 16. Get Notification Statistics (Admin)

```bash
GET http://localhost:3004/api/admin/notifications/stats?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Notification statistics retrieved successfully",
  "data": {
    "overview": {
      "total": 150,
      "pending": 5,
      "sent": 140,
      "failed": 5
    },
    "byType": [
      {
        "_id": "RESERVATION_CREATED",
        "total": 50,
        "statuses": [
          { "status": "SENT", "count": 48 },
          { "status": "FAILED", "count": 2 }
        ]
      }
    ]
  }
}
```

---

### 17. Test Email Configuration (Admin)

```bash
GET http://localhost:3004/api/admin/notifications/test-email
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Note:** Requires Admin role. Tests SMTP connection.

**Response (200):**
```json
{
  "success": true,
  "message": "Email configuration is valid",
  "data": {
    "success": true,
    "message": "Email configuration is valid"
  }
}
```

---

### 18. Send Bulk Notifications (Admin)

```bash
POST http://localhost:3004/api/admin/notifications/bulk
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "recipientIds": ["user_id_1", "user_id_2"],
  "subject": "Important Announcement",
  "message": "Event update notification",
  "type": "default",
  "templateData": {
    "message": "The event has been rescheduled"
  }
}
```

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Bulk notifications sent",
  "data": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "results": [
      {
        "email": "user1@example.com",
        "success": true,
        "messageId": "<message_id>"
      }
    ]
  }
}
```

---

### 19. Retry Failed Notifications (Admin)

```bash
POST http://localhost:3004/api/admin/notifications/retry-failed
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Note:** Requires Admin role. Retries all failed notifications that haven't exceeded max retry count.

**Response (200):**
```json
{
  "success": true,
  "message": "Failed notifications retry completed",
  "data": {
    "total": 5,
    "successful": 4,
    "failed": 1
  }
}
```

---

### 20. Delete Notification (Admin)

```bash
DELETE http://localhost:3004/api/admin/notifications/507f1f77bcf86cd799439011
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### 21. Scan QR Code (Admin)

```bash
POST http://localhost:3004/api/admin/qrcodes/scan
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "qrData": "encrypted_qr_data_string",
  "location": "Main Entrance",
  "deviceInfo": "Scanner Device A1"
}
```

**Note:** Requires Admin role. Records scan in history.

**Response (200):**
```json
{
  "success": true,
  "message": "QR code scanned successfully",
  "data": {
    "success": true,
    "message": "QR code scanned successfully",
    "qrCodeRecord": {
      "isScanned": true,
      "scannedAt": "2025-02-01T09:00:00Z",
      "scanCount": 1
    },
    "decodedData": {
      "reservationNumber": "RES-2025-0001",
      "userEmail": "user@example.com"
    }
  }
}
```

---

### 22. Get QR Code Scan History (Admin)

```bash
GET http://localhost:3004/api/admin/qrcodes/scan-history/507f1f77bcf86cd799439011
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "QR code scan history retrieved successfully",
  "data": {
    "qrCode": {
      "reservation": "507f1f77bcf86cd799439011",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isScanned": true,
      "scannedAt": "2025-02-01T09:00:00Z",
      "scannedBy": {
        "name": "Admin User",
        "email": "admin@bookfair.com"
      },
      "scanCount": 2,
      "isValid": true
    },
    "scanHistory": [
      {
        "scannedBy": {
          "name": "Admin User"
        },
        "scannedAt": "2025-02-01T09:00:00Z",
        "location": "Main Entrance",
        "deviceInfo": "Scanner A1"
      }
    ]
  }
}
```

---

### 23. Get All Scanned QR Codes (Admin)

```bash
GET http://localhost:3004/api/admin/qrcodes/scanned?page=1&limit=20
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Scanned QR codes retrieved successfully",
  "data": {
    "qrCodes": [
      {
        "_id": "qrcode_id",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "reservation": {
          "reservationNumber": "RES-2025-0001",
          "stall": "stall_id"
        },
        "scannedAt": "2025-02-01T09:00:00Z",
        "scannedBy": {
          "name": "Admin User"
        },
        "scanCount": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 85,
      "itemsPerPage": 20
    }
  }
}
```

---

## Data Models

### Notification Schema
```javascript
{
  type: String,              // RESERVATION_CREATED, RESERVATION_APPROVED, etc.
  recipient: ObjectId,       // User reference
  reservation: ObjectId,     // Reservation reference
  channel: String,           // EMAIL, SMS, PUSH (default: EMAIL)
  subject: String,
  message: String,
  emailData: {
    to: String,
    cc: [String],
    bcc: [String],
    attachments: [Object]
  },
  status: String,            // PENDING, SENT, FAILED, DELIVERED, BOUNCED
  sentAt: Date,
  deliveredAt: Date,
  failureReason: String,
  retryCount: Number,
  maxRetries: Number,
  metadata: Object,
  priority: String,          // LOW, NORMAL, HIGH, URGENT
  scheduledFor: Date,
  read: Boolean,
  readAt: Date
}
```

### NotificationPreference Schema
```javascript
{
  user: ObjectId,           // User reference (unique)
  email: {
    enabled: Boolean,
    reservationCreated: Boolean,
    reservationApproved: Boolean,
    reservationRejected: Boolean,
    reservationConfirmed: Boolean,
    paymentReminder: Boolean,
    reservationReminder: Boolean,
    reservationCancelled: Boolean,
    qrCodeSent: Boolean
  },
  sms: {
    enabled: Boolean,
    reservationApproved: Boolean,
    reservationReminder: Boolean
  },
  push: {
    enabled: Boolean,
    reservationCreated: Boolean,
    reservationApproved: Boolean,
    paymentReminder: Boolean
  },
  language: String,         // en, si, ta
  timezone: String
}
```

### QRCode Schema
```javascript
{
  reservation: ObjectId,    // Reservation reference (unique)
  user: ObjectId,           // User reference
  qrCodeData: String,
  encryptedData: String,
  qrCodeImage: String,      // Base64 image
  metadata: {
    reservationNumber: String,
    stallName: String,
    startDate: Date,
    endDate: Date,
    totalAmount: Number
  },
  isScanned: Boolean,
  scannedAt: Date,
  scannedBy: ObjectId,
  scanCount: Number,
  scanHistory: [Object],
  isValid: Boolean,
  validUntil: Date,
  expiresAt: Date
}
```

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

---

## Scheduled Jobs

The notification service runs automated background jobs:

1. **Process Pending Notifications** - Every 1 minute
   - Sends queued notifications respecting user preferences

2. **Cleanup Expired QR Codes** - Every 1 hour
   - Marks expired QR codes as invalid

3. **Send Payment Reminders** - Every 6 hours
   - Reminds users about payment deadlines (within 2 days)

4. **Send Reservation Reminders** - Daily at 9 AM
   - Notifies users about upcoming reservations (3 days before)

---

## Email Templates

Available Handlebars templates in `src/templates/emails/`:

- `reservation-created.hbs` - Reservation creation notification
- `reservation-approved.hbs` - Approval with payment instructions
- `reservation-rejected.hbs` - Rejection with reason
- `qrcode-email.hbs` - QR code delivery after confirmation
- `payment-reminder.hbs` - Payment deadline reminder
- `reservation-reminder.hbs` - Upcoming reservation reminder
- `reservation-cancelled.hbs` - Cancellation with refund info

---


