# Frontend Integration Guide for Travel Backend API

## Backend Setup (Run First)

```bash
# Terminal 1 - Start Laravel backend
cd travel-backend
php artisan serve
# API runs at: http://localhost:8000
```

---

## Frontend Setup

### 1. Install Axios
```bash
npm install axios
```

### 2. Create API Service (`src/services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Automatically add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 3. Auth Service (`src/services/authService.js`)

```javascript
import api from './api';

export const authService = {
  async register(name, email, password) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async getUser() {
    const response = await api.get('/user');
    return response.data.data;
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  isAdmin() {
    const user = this.getStoredUser();
    return user?.role === 'admin';
  },
};
```

---

### 4. Package Service (`src/services/packageService.js`)

```javascript
import api from './api';

export const packageService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.trip_type) params.append('trip_type', filters.trip_type);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.featured) params.append('featured', '1');
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);

    const response = await api.get(`/packages?${params}`);
    return response.data.data; // { packages, pagination }
  },

  async getById(id) {
    const response = await api.get(`/packages/${id}`);
    return response.data.data;
  },

  async getFeatured() {
    const response = await api.get('/packages?featured=1');
    return response.data.data.packages;
  },
};
```

---

### 5. Booking Service (`src/services/bookingService.js`)

```javascript
import api from './api';

export const bookingService = {
  async getAll(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/bookings${params}`);
    return response.data.data; // { bookings, pagination }
  },

  async getById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  async create(bookingData) {
    // bookingData: { package_id, travel_date, travelers, travelers_details, notes }
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async cancel(id, requestRefund = false) {
    const response = await api.post(`/bookings/${id}/cancel`, {
      request_refund: requestRefund,
    });
    return response.data;
  },

  async getInvoice(id) {
    const response = await api.get(`/bookings/${id}/invoice`);
    return response.data.data;
  },

  async downloadInvoicePdf(id) {
    const response = await api.get(`/bookings/${id}/invoice/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
```

---

### 6. Payment Service with Razorpay (`src/services/paymentService.js`)

```javascript
import api from './api';

export const paymentService = {
  async createOrder(bookingId) {
    const response = await api.post('/payments/create-order', {
      booking_id: bookingId,
    });
    return response.data.data; // { order_id, amount, currency, key, prefill }
  },

  async verifyPayment(bookingId, razorpayData) {
    const response = await api.post('/payments/verify', {
      booking_id: bookingId,
      razorpay_order_id: razorpayData.razorpay_order_id,
      razorpay_payment_id: razorpayData.razorpay_payment_id,
      razorpay_signature: razorpayData.razorpay_signature,
    });
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/payments');
    return response.data.data.payments;
  },

  // Initialize Razorpay checkout
  async initiatePayment(bookingId, onSuccess, onError) {
    const orderData = await this.createOrder(bookingId);

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Travel Agency',
      description: `Booking: ${orderData.booking.package_name}`,
      order_id: orderData.order_id,
      prefill: orderData.prefill,
      handler: async (response) => {
        try {
          const result = await this.verifyPayment(bookingId, response);
          onSuccess(result);
        } catch (err) {
          onError(err);
        }
      },
      theme: { color: '#2563eb' },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  },
};
```

**Add Razorpay script in `index.html`:**
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

### 7. Notification Service (`src/services/notificationService.js`)

```javascript
import api from './api';

export const notificationService = {
  async getAll() {
    const response = await api.get('/notifications');
    return response.data.data; // { notifications, unread_count }
  },

  async markAsRead(notificationIds = [], markAll = false) {
    const response = await api.post('/notifications/read', {
      notification_ids: notificationIds,
      mark_all: markAll,
    });
    return response.data;
  },
};
```

---

## Usage Examples

### Login Component
```jsx
import { authService } from '../services/authService';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const result = await authService.login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Login failed');
  }
};
```

### Package List Component
```jsx
import { packageService } from '../services/packageService';

useEffect(() => {
  const fetchPackages = async () => {
    const data = await packageService.getAll({ featured: true });
    setPackages(data.packages);
  };
  fetchPackages();
}, []);
```

### Create Booking
```jsx
const handleBooking = async () => {
  const bookingData = {
    package_id: selectedPackage.id,
    travel_date: '2026-03-15',
    travelers: 2,
    travelers_details: [
      { name: 'John Doe', age: 30, contact: '9876543210' },
      { name: 'Jane Doe', age: 28, contact: '9876543211' },
    ],
  };
  
  const result = await bookingService.create(bookingData);
  if (result.success) {
    // Redirect to payment
    paymentService.initiatePayment(
      result.data.id,
      (res) => alert('Payment successful!'),
      (err) => alert('Payment failed')
    );
  }
};
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@travel.com | password |
| Customer | test@example.com | password |

---

## API Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```
