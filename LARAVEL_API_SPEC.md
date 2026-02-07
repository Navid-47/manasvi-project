# Laravel Backend API Specification
## Travel Agency Management System

This document provides a complete API contract for building the Laravel backend to integrate with the React frontend. Uses **Laravel Sanctum** for token-based authentication and **MySQL** via XAMPP.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Laravel 10+ |
| Authentication | Laravel Sanctum (Token-based) |
| Database | MySQL (via XAMPP) |
| Payment Gateway | Razorpay |
| PDF Generation | barryvdh/laravel-dompdf |
| QR Code | simplesoftwareio/simple-qrcode |
| Email | Laravel Mail (SMTP) |
| SMS (Optional) | Twilio/MSG91 |

---

## Database Schema

### 1. `users` Table

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone VARCHAR(20) NULL,
    avatar VARCHAR(255) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 2. `packages` Table

```sql
CREATE TABLE packages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NULL,
    duration VARCHAR(50) NOT NULL,
    duration_days INT UNSIGNED NULL,
    trip_type ENUM('Domestic', 'International') DEFAULT 'Domestic',
    category VARCHAR(100) NULL,
    image VARCHAR(500) NULL,
    images JSON NULL,
    itinerary JSON NULL,
    inclusions JSON NULL,
    exclusions JSON NULL,
    highlights JSON NULL,
    difficulty ENUM('Easy', 'Moderate', 'Challenging') DEFAULT 'Easy',
    rating DECIMAL(2,1) DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 3. `bookings` Table

```sql
CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    package_id BIGINT UNSIGNED NOT NULL,
    travel_date DATE NOT NULL,
    travelers INT UNSIGNED NOT NULL DEFAULT 1,
    travelers_details JSON NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    notes TEXT NULL,
    cancelled_at TIMESTAMP NULL,
    refund_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);
```

**`travelers_details` JSON Structure:**
```json
[
  {
    "name": "John Doe",
    "age": 30,
    "contact": "9876543210",
    "passportNumber": "A1234567"
  }
]
```

---

### 4. `payments` Table

```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    booking_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    razorpay_order_id VARCHAR(100) NULL,
    razorpay_payment_id VARCHAR(100) NULL,
    razorpay_signature VARCHAR(255) NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
    payment_method VARCHAR(50) NULL,
    error_message TEXT NULL,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 5. `notifications` Table

```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NULL,
    type ENUM('booking', 'payment', 'reminder', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Headers (All Protected Routes)
```
Authorization: Bearer {sanctum_token}
Accept: application/json
Content-Type: application/json
```

---

## 1. Authentication APIs

### POST `/register`

**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer",
            "created_at": "2026-02-06T12:00:00Z"
        },
        "token": "1|abc123xyz..."
    }
}
```

---

### POST `/login`

**Request:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer"
        },
        "token": "2|xyz789abc..."
    }
}
```

**Error (401):**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

---

### POST `/logout` 🔒

**Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

### GET `/user` 🔒

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "phone": "9876543210",
        "avatar": null,
        "created_at": "2026-02-06T12:00:00Z"
    }
}
```

---

### PUT `/user/profile` 🔒

**Request:**
```json
{
    "name": "John Updated",
    "phone": "9876543210"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": { ... }
}
```

---

### POST `/forgot-password`

**Request:**
```json
{
    "email": "john@example.com"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Password reset link sent to email"
}
```

---

## 2. Packages APIs

### GET `/packages`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name/destination |
| category | string | Filter by category |
| trip_type | string | Domestic/International |
| min_price | number | Minimum price filter |
| max_price | number | Maximum price filter |
| sort | string | price_asc, price_desc, rating, duration, name |
| featured | boolean | Only featured packages |
| page | number | Pagination page |
| per_page | number | Items per page (default: 10) |

**Response (200):**
```json
{
    "success": true,
    "data": {
        "packages": [
            {
                "id": 1,
                "name": "7-Day Swiss Alps Adventure",
                "destination": "Swiss Alps, Switzerland",
                "description": "...",
                "price": 120000,
                "original_price": 150000,
                "duration": "7 days",
                "duration_days": 7,
                "trip_type": "International",
                "category": "Adventure",
                "image": "https://...",
                "images": ["https://..."],
                "itinerary": ["Day 1: Arrival", "Day 2: ..."],
                "inclusions": ["7 nights accommodation", "..."],
                "exclusions": ["Visa fees", "..."],
                "highlights": ["Mountain hiking", "..."],
                "difficulty": "Moderate",
                "rating": 4.8,
                "featured": true,
                "active": true
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 48,
            "per_page": 10
        }
    }
}
```

---

### GET `/packages/{id}`

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "7-Day Swiss Alps Adventure",
        ...
    }
}
```

---

### POST `/admin/packages` 🔒 (Admin Only)

**Request:**
```json
{
    "name": "New Package",
    "destination": "Destination City",
    "description": "Package description...",
    "price": 50000,
    "original_price": 60000,
    "duration": "5 days",
    "duration_days": 5,
    "trip_type": "Domestic",
    "category": "Adventure",
    "image": "https://...",
    "images": ["https://..."],
    "itinerary": ["Day 1: Arrival", "Day 2: Sightseeing"],
    "inclusions": ["Hotel", "Meals", "Transfers"],
    "exclusions": ["Flights", "Personal expenses"],
    "highlights": ["Activity 1", "Activity 2"],
    "difficulty": "Easy",
    "featured": false,
    "active": true
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Package created successfully",
    "data": { ... }
}
```

---

### PUT `/admin/packages/{id}` 🔒 (Admin Only)

**Request:** Same as POST

**Response (200):**
```json
{
    "success": true,
    "message": "Package updated successfully",
    "data": { ... }
}
```

---

### DELETE `/admin/packages/{id}` 🔒 (Admin Only)

**Response (200):**
```json
{
    "success": true,
    "message": "Package deleted successfully"
}
```

---

### PATCH `/admin/packages/{id}/toggle-active` 🔒 (Admin Only)

**Response (200):**
```json
{
    "success": true,
    "message": "Package status updated",
    "data": {
        "active": false
    }
}
```

---

## 3. Bookings APIs

### POST `/bookings` 🔒

**Request:**
```json
{
    "package_id": 1,
    "travel_date": "2026-03-15",
    "travelers": 2,
    "travelers_details": [
        {
            "name": "John Doe",
            "age": 30,
            "contact": "9876543210",
            "passportNumber": "A1234567"
        },
        {
            "name": "Jane Doe",
            "age": 28,
            "contact": "9876543211",
            "passportNumber": "A1234568"
        }
    ],
    "notes": "Vegetarian meals required"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Booking created successfully",
    "data": {
        "id": 1,
        "booking_number": "BKG-001",
        "package": {
            "id": 1,
            "name": "7-Day Swiss Alps Adventure",
            "destination": "Swiss Alps, Switzerland"
        },
        "travel_date": "2026-03-15",
        "travelers": 2,
        "travelers_details": [...],
        "amount": 240000,
        "status": "Pending",
        "created_at": "2026-02-06T12:00:00Z"
    }
}
```

---

### GET `/bookings` 🔒 (Customer's own bookings)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Pending, Confirmed, Cancelled, Completed |
| page | number | Pagination |

**Response (200):**
```json
{
    "success": true,
    "data": {
        "bookings": [
            {
                "id": 1,
                "booking_number": "BKG-001",
                "package": { "id": 1, "name": "...", "destination": "...", "image": "..." },
                "travel_date": "2026-03-15",
                "travelers": 2,
                "amount": 240000,
                "status": "Confirmed",
                "created_at": "2026-02-06T12:00:00Z"
            }
        ],
        "pagination": { ... }
    }
}
```

---

### GET `/bookings/{id}` 🔒

**Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "booking_number": "BKG-001",
        "package": { ... },
        "travel_date": "2026-03-15",
        "travelers": 2,
        "travelers_details": [...],
        "amount": 240000,
        "status": "Confirmed",
        "notes": "Vegetarian meals required",
        "payment": {
            "id": 1,
            "payment_number": "TXN-0001",
            "razorpay_payment_id": "pay_ABC123",
            "status": "Success",
            "paid_at": "2026-02-06T12:30:00Z"
        },
        "created_at": "2026-02-06T12:00:00Z"
    }
}
```

---

### PATCH `/bookings/{id}/cancel` 🔒

**Request:**
```json
{
    "request_refund": true
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
        "status": "Cancelled",
        "refund_requested": true
    }
}
```

---

### GET `/admin/bookings` 🔒 (Admin Only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |
| search | string | Search by booking number or customer email |
| from_date | date | Filter from date |
| to_date | date | Filter to date |
| page | number | Pagination |

**Response (200):** Same structure with all bookings

---

### PATCH `/admin/bookings/{id}/status` 🔒 (Admin Only)

**Request:**
```json
{
    "status": "Confirmed"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Booking status updated",
    "data": { ... }
}
```

---

## 4. Payment APIs (Razorpay Integration)

### POST `/payments/create-order` 🔒

**Request:**
```json
{
    "booking_id": 1
}
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "order_id": "order_ABC123XYZ",
        "amount": 24000000,
        "currency": "INR",
        "key": "rzp_test_xxxxx",
        "booking": {
            "id": 1,
            "booking_number": "BKG-001",
            "package_name": "7-Day Swiss Alps Adventure"
        },
        "prefill": {
            "name": "John Doe",
            "email": "john@example.com",
            "contact": "9876543210"
        }
    }
}
```

> **Note:** Amount is in **paise** (₹240000 = 24000000 paise)

---

### POST `/payments/verify` 🔒

**Request:**
```json
{
    "booking_id": 1,
    "razorpay_order_id": "order_ABC123XYZ",
    "razorpay_payment_id": "pay_DEF456UVW",
    "razorpay_signature": "signature_hash_here"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Payment verified successfully",
    "data": {
        "payment": {
            "id": 1,
            "payment_number": "TXN-0001",
            "razorpay_payment_id": "pay_DEF456UVW",
            "status": "Success",
            "amount": 240000
        },
        "booking": {
            "id": 1,
            "status": "Confirmed"
        }
    }
}
```

**Error (400):**
```json
{
    "success": false,
    "message": "Payment verification failed"
}
```

---

### POST `/payments/webhook`

Razorpay webhook endpoint (no auth required, verified via signature).

**Headers:**
```
X-Razorpay-Signature: webhook_signature
```

**Handles Events:**
- `payment.captured` → Update payment status to Success
- `payment.failed` → Update payment status to Failed

---

### GET `/payments` 🔒 (Customer's payment history)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "payments": [
            {
                "id": 1,
                "payment_number": "TXN-0001",
                "booking": {
                    "booking_number": "BKG-001",
                    "package_name": "7-Day Swiss Alps Adventure"
                },
                "amount": 240000,
                "status": "Success",
                "payment_method": "upi",
                "paid_at": "2026-02-06T12:30:00Z"
            }
        ]
    }
}
```

---

### GET `/admin/payments` 🔒 (Admin Only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Success, Failed, Pending |
| from_date | date | Filter from date |
| to_date | date | Filter to date |

**Response (200):** Full payment report with all transactions

---

## 5. Invoice API

### GET `/bookings/{id}/invoice` 🔒

**Response (200):**
```json
{
    "success": true,
    "data": {
        "invoice_number": "INV-2026-0001",
        "booking": { ... },
        "payment": { ... },
        "customer": {
            "name": "John Doe",
            "email": "john@example.com"
        },
        "qr_code": "data:image/png;base64,..."
    }
}
```

---

### GET `/bookings/{id}/invoice/pdf` 🔒

**Response:** PDF file download

---

## 6. Notifications APIs

### GET `/notifications` 🔒

**Response (200):**
```json
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": 1,
                "title": "Booking Confirmed",
                "message": "Your booking BKG-001 has been confirmed.",
                "type": "booking",
                "is_read": false,
                "created_at": "2026-02-06T12:00:00Z"
            }
        ],
        "unread_count": 5
    }
}
```

---

### PATCH `/notifications/mark-read` 🔒

**Request:**
```json
{
    "notification_ids": [1, 2, 3]
}
```

Or mark all:
```json
{
    "mark_all": true
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Notifications marked as read"
}
```

---

## 7. Admin Dashboard APIs

### GET `/admin/dashboard/stats` 🔒 (Admin Only)

**Response (200):**
```json
{
    "success": true,
    "data": {
        "total_bookings": 156,
        "total_revenue": 15600000,
        "total_customers": 89,
        "total_packages": 24,
        "pending_bookings": 12,
        "confirmed_bookings": 98,
        "cancelled_bookings": 8,
        "this_month": {
            "bookings": 23,
            "revenue": 2300000
        }
    }
}
```

---

### GET `/admin/analytics/sales` 🔒 (Admin Only)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| period | string | week, month, year |
| from_date | date | Custom date range |
| to_date | date | Custom date range |

**Response (200):**
```json
{
    "success": true,
    "data": {
        "revenue_by_period": [
            { "label": "Jan", "value": 1500000 },
            { "label": "Feb", "value": 1800000 }
        ],
        "top_packages": [
            { "id": 1, "name": "Swiss Alps Adventure", "bookings": 45, "revenue": 5400000 }
        ],
        "bookings_by_status": {
            "Confirmed": 98,
            "Pending": 12,
            "Cancelled": 8
        }
    }
}
```

---

## Laravel Sanctum Setup

### 1. Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Configure `config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### 3. User Model
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

### 4. Auth Controller Example
```php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => $user,
            'token' => $token
        ]
    ]);
}
```

---

## Razorpay Integration

### 1. Install Package
```bash
composer require razorpay/razorpay
```

### 2. Environment Variables
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### 3. Create Order Example
```php
use Razorpay\Api\Api;

public function createOrder(Request $request)
{
    $booking = Booking::findOrFail($request->booking_id);
    
    $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
    
    $order = $api->order->create([
        'amount' => $booking->amount * 100, // in paise
        'currency' => 'INR',
        'receipt' => $booking->booking_number
    ]);
    
    // Store order_id in payments table
    Payment::create([
        'booking_id' => $booking->id,
        'user_id' => auth()->id(),
        'razorpay_order_id' => $order['id'],
        'amount' => $booking->amount,
        'status' => 'Pending'
    ]);
    
    return response()->json([
        'success' => true,
        'data' => [
            'order_id' => $order['id'],
            'amount' => $order['amount'],
            'currency' => $order['currency'],
            'key' => config('services.razorpay.key')
        ]
    ]);
}
```

### 4. Verify Payment Example
```php
public function verifyPayment(Request $request)
{
    $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
    
    $attributes = [
        'razorpay_order_id' => $request->razorpay_order_id,
        'razorpay_payment_id' => $request->razorpay_payment_id,
        'razorpay_signature' => $request->razorpay_signature
    ];
    
    try {
        $api->utility->verifyPaymentSignature($attributes);
        
        // Update payment record
        $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
        $payment->update([
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature,
            'status' => 'Success',
            'paid_at' => now()
        ]);
        
        // Update booking status
        $payment->booking->update(['status' => 'Confirmed']);
        
        // Send confirmation email
        Mail::to($payment->booking->user)->send(new BookingConfirmedMail($payment->booking));
        
        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Payment verification failed'
        ], 400);
    }
}
```

---

## Suggested Folder Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── PackageController.php
│   │   │   ├── BookingController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── NotificationController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── PackageController.php
│   │   │       ├── BookingController.php
│   │   │       └── AnalyticsController.php
│   ├── Middleware/
│   │   └── AdminMiddleware.php
│   └── Resources/
│       ├── PackageResource.php
│       ├── BookingResource.php
│       └── PaymentResource.php
├── Models/
│   ├── User.php
│   ├── Package.php
│   ├── Booking.php
│   ├── Payment.php
│   └── Notification.php
├── Services/
│   ├── RazorpayService.php
│   └── InvoiceService.php
└── Mail/
    ├── BookingConfirmedMail.php
    ├── PaymentSuccessMail.php
    └── TravelReminderMail.php

routes/
└── api.php
```

---

## Routes Example (`routes/api.php`)

```php
use App\Http\Controllers\Api\*;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::get('/bookings/{id}/invoice', [BookingController::class, 'invoice']);
    Route::get('/bookings/{id}/invoice/pdf', [BookingController::class, 'invoicePdf']);
    
    // Payments
    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/verify', [PaymentController::class, 'verify']);
    Route::get('/payments', [PaymentController::class, 'index']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/mark-read', [NotificationController::class, 'markRead']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [Admin\DashboardController::class, 'stats']);
        Route::get('/analytics/sales', [Admin\AnalyticsController::class, 'sales']);
        
        Route::apiResource('/packages', Admin\PackageController::class);
        Route::patch('/packages/{id}/toggle-active', [Admin\PackageController::class, 'toggleActive']);
        
        Route::get('/bookings', [Admin\BookingController::class, 'index']);
        Route::patch('/bookings/{id}/status', [Admin\BookingController::class, 'updateStatus']);
        
        Route::get('/payments', [Admin\PaymentController::class, 'index']);
    });
});

// Razorpay webhook (no auth)
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
```

---

## Error Response Format

All errors should follow this format:

```json
{
    "success": false,
    "message": "Error message here",
    "errors": {
        "field_name": ["Validation error message"]
    }
}
```
