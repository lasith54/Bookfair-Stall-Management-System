# Stall Service API Documentation

Base URL: `http://localhost:3000/api` (via API Gateway)

## Endpoints

### 1. Get All Stalls

```bash
GET http://localhost:3000/api/stalls?status=available&zone=A&page=1&limit=10
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status: available, reserved, occupied, maintenance, inactive
- `category` - Filter by category ID
- `zone` - Filter by zone (A, B, C)
- `floor` - Filter by floor (1, 2)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in stall number, zone, or notes
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc or desc (default: desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stalls": [
      {
        "_id": "...",
        "stallNumber": "A1-001",
        "location": {
          "zone": "A",
          "floor": "1",
          "section": "Front",
          "position": "Row 1"
        },
        "dimensions": {
          "width": 10,
          "length": 10,
          "height": 3
        },
        "category": {
          "_id": "...",
          "name": "Books",
          "icon": "book",
          "color": "#3498db"
        },
        "pricing": {
          "basePrice": 10000,
          "currency": "LKR",
          "pricingModel": "per_day"
        },
        "amenities": ["Display Shelves", "Counter", "Lighting"],
        "features": {
          "hasElectricity": true,
          "hasWifi": true,
          "hasStorage": true,
          "hasDisplay": true
        },
        "capacity": {
          "maxOccupants": 3,
          "maxItems": 50
        },
        "status": "available",
        "area": 100,
        "fullLocation": "A, 1, Front, Row 1",
        "isActive": true,
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 10,
      "pages": 12
    }
  }
}
```

---

### 2. Get Stall by ID

```bash
GET http://localhost:3000/api/stalls/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stall": {
      "_id": "507f1f77bcf86cd799439011",
      "stallNumber": "A1-001",
      "location": {
        "zone": "A",
        "floor": "1",
        "section": "Front",
        "position": "Row 1"
      },
      "dimensions": {
        "width": 10,
        "length": 10,
        "height": 3
      },
      "category": {
        "_id": "...",
        "name": "Books",
        "icon": "book",
        "color": "#3498db"
      },
      "pricing": {
        "basePrice": 10000,
        "currency": "LKR",
        "pricingModel": "per_day"
      },
      "amenities": ["Display Shelves", "Counter", "Lighting"],
      "features": {
        "hasElectricity": true,
        "hasWifi": true,
        "hasStorage": true,
        "hasDisplay": true
      },
      "capacity": {
        "maxOccupants": 3,
        "maxItems": 50
      },
      "status": "available",
      "area": 100,
      "fullLocation": "A, 1, Front, Row 1"
    }
  }
}
```

---

### 3. Create Stall (Protected)

```bash
POST http://localhost:3000/api/stalls
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "location": {
    "zone": "A",
    "floor": "1",
    "section": "Front",
    "position": "Row 5"
  },
  "dimensions": {
    "width": 10,
    "length": 12,
    "height": 3
  },
  "category": "category_object_id",
  "pricing": {
    "basePrice": 12000
  },
  "amenities": ["Display Shelves", "Counter", "Storage Cabinet"],
  "features": {
    "hasElectricity": true,
    "hasWifi": true,
    "hasStorage": true,
    "hasDisplay": true
  },
  "capacity": {
    "maxOccupants": 3,
    "maxItems": 60
  }
}
```

**Note:** Requires Admin or Employee role. Stall number will be auto-generated if not provided.

**Response (201):**
```json
{
  "success": true,
  "message": "Stall created successfully",
  "data": {
    "stall": {
      "_id": "...",
      "stallNumber": "A1-025",
      "location": { ... },
      "status": "available",
      "createdAt": "2025-11-17T10:00:00Z"
    }
  }
}
```

---

### 4. Update Stall (Protected)

```bash
PUT http://localhost:3000/api/stalls/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "maintenance",
  "pricing": {
    "basePrice": 15000
  },
  "notes": "Under renovation until next month"
}
```

**Note:** Requires Admin or Employee role. All fields are optional.

**Response (200):**
```json
{
  "success": true,
  "message": "Stall updated successfully",
  "data": {
    "stall": {
      "_id": "507f1f77bcf86cd799439011",
      "stallNumber": "A1-001",
      "status": "maintenance",
      "pricing": {
        "basePrice": 15000
      },
      "notes": "Under renovation until next month"
    }
  }
}
```

---

### 5. Delete Stall (Protected)

```bash
DELETE http://localhost:3000/api/stalls/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note:** Requires Admin role. Performs soft delete (sets `isActive` to false).

**Response (200):**
```json
{
  "success": true,
  "message": "Stall deleted successfully"
}
```

---

### 6. Update Stall Status (Protected)

```bash
PATCH http://localhost:3000/api/stalls/507f1f77bcf86cd799439011/status
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "maintenance"
}
```

**Note:** Requires Admin or Employee role. Valid values: `available`, `reserved`, `occupied`, `maintenance`, `inactive`.

**Response (200):**
```json
{
  "success": true,
  "message": "Stall status updated successfully",
  "data": {
    "stall": {
      "_id": "507f1f77bcf86cd799439011",
      "stallNumber": "A1-001",
      "status": "maintenance"
    }
  }
}
```

---

### 7. Bulk Update Stalls (Protected)

```bash
POST http://localhost:3000/api/stalls/bulk-update
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "stallIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "updates": {
    "features.hasWifi": true,
    "pricing.basePrice": 10000
  }
}
```

**Note:** Requires Admin role.

**Response (200):**
```json
{
  "success": true,
  "message": "Stalls updated successfully",
  "data": {
    "matched": 2,
    "modified": 2
  }
}
```

---

### 8. Get Stall Statistics (Protected)

```bash
GET http://localhost:3000/api/stalls/statistics
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note:** Requires Admin or Employee role.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 120,
      "available": 96,
      "reserved": 18,
      "occupied": 0,
      "maintenance": 6,
      "occupancyRate": "20.00"
    },
    "byCategory": [
      {
        "_id": "category_id",
        "categoryName": "Books",
        "count": 45
      }
    ],
    "byZone": [
      {
        "_id": "A",
        "count": 40,
        "available": 32
      }
    ],
    "pricing": {
      "avgPrice": 10500,
      "minPrice": 5000,
      "maxPrice": 15000
    }
    }
  }
}
```

---

## Category Endpoints

### 9. Get All Categories

```bash
GET http://localhost:3000/api/categories
```

**Query Parameters:**
- `includeInactive` (boolean) - Include inactive categories (default: false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Books",
        "description": "General book stalls for various genres",
        "icon": "book",
        "color": "#3498db",
        "isActive": true,
        "stallCount": 45,
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

### 10. Get Category by ID

```bash
GET http://localhost:3000/api/categories/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Books",
      "description": "General book stalls",
      "icon": "book",
      "color": "#3498db",
      "isActive": true,
      "stallCount": 45
    },
    "stalls": [
      {
        "_id": "...",
        "stallNumber": "A1-001",
        "location": { "zone": "A", "floor": "1" },
        "status": "available"
      }
    ]
  }
}
```

---

### 11. Create Category (Protected)

```bash
POST http://localhost:3000/api/categories
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Art & Crafts",
  "description": "Stalls for art books and craft materials",
  "icon": "palette",
  "color": "#9b59b6"
}
```

**Note:** Requires Admin role.

**Response (201):**
curl -X POST "http://localhost:3000/api/categories" \
  -H "Authorization: Bearer <admin_token>" \
**Note:** Requires Admin role.

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Art & Crafts",
      "description": "Stalls for art books and craft materials",
      "icon": "palette",
      "color": "#9b59b6",
      "isActive": true
    }
  }
}
```

---

### 12. Update Category (Protected)

```bash
PUT http://localhost:3000/api/categories/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "description": "Updated description",
  "color": "#e67e22"
}
```

**Note:** Requires Admin role. All fields are optional.

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Books",
      "description": "Updated description",
      "color": "#e67e22"
    }
  }
}
```

---

### 13. Delete Category (Protected)

```bash
DELETE http://localhost:3000/api/categories/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note:** Requires Admin role. Cannot delete if stalls are using the category.

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Response (400)** - if stalls exist:
```json
{
  "success": false,
  "message": "Cannot delete category. 45 stall(s) are still using this category"
}
```


---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "pricing.basePrice",
      "message": "Price cannot be negative"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Stall not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error retrieving stalls",
  "error": "Database connection failed"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are in LKR (Sri Lankan Rupees)
- Stall numbers are auto-generated if not provided (format: `{Zone}{Floor}-{Sequence}`)
- Soft deletes are used (`isActive` flag) to maintain data integrity
- `area` and `fullLocation` are virtual fields (computed on the fly)

