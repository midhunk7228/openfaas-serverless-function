# Brands API Documentation

## 🌐 Base URL

```
https://your-api.onrender.com/api
```

## 📋 Available Endpoints

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| `GET`  | `/api/brands`     | Get all brands with filtering |
| `GET`  | `/api/brands/:id` | Get specific brand by ID      |
| `GET`  | `/api/categories` | Get all available categories  |
| `GET`  | `/api/countries`  | Get all available countries   |

---

## 🎯 Endpoint Details

### 1. Get All Brands

**Endpoint:** `GET /api/brands`

**Query Parameters:**

- `category` - Filter by category (e.g., "Technology")
- `country` - Filter by country (e.g., "USA")
- `search` - Search in name/description
- `limit` - Results per page (default: 10)
- `offset` - Skip N results (default: 0)
- `sortBy` - Sort by: "name", "founded", "id"

**Examples:**

```bash
# All brands
curl https://your-api.onrender.com/api/brands

# Technology brands
curl "https://your-api.onrender.com/api/brands?category=Technology"

# USA brands, limit 5
curl "https://your-api.onrender.com/api/brands?country=USA&limit=5"

# Search for Nike
curl "https://your-api.onrender.com/api/brands?search=nike"

# Combined filters
curl "https://your-api.onrender.com/api/brands?category=Technology&country=USA&limit=3"
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-10-23T16:00:00.000Z",
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Nike",
        "category": "Sports & Apparel",
        "country": "USA",
        "founded": 1964,
        "description": "Athletic footwear and apparel",
        "website": "https://www.nike.com"
      }
    ],
    "pagination": {
      "total": 10,
      "limit": 10,
      "offset": 0,
      "count": 10,
      "hasMore": false
    },
    "filters": {
      "applied": {
        "category": null,
        "country": null,
        "search": null
      },
      "available": {
        "categories": ["Automotive", "Technology", ...],
        "countries": ["USA", "Germany", ...]
      }
    }
  }
}
```

---

### 2. Get Brand by ID

**Endpoint:** `GET /api/brands/:id`

**Example:**

```bash
curl https://your-api.onrender.com/api/brands/1
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-10-23T16:00:00.000Z",
  "data": {
    "brand": {
      "id": 1,
      "name": "Nike",
      "category": "Sports & Apparel",
      "country": "USA",
      "founded": 1964,
      "description": "Athletic footwear and apparel",
      "website": "https://www.nike.com"
    }
  }
}
```

---

### 3. Get Categories

**Endpoint:** `GET /api/categories`

**Example:**

```bash
curl https://your-api.onrender.com/api/categories
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-10-23T16:00:00.000Z",
  "data": {
    "categories": [
      "Automotive",
      "Beverages",
      "Food & Beverage",
      "Luxury Fashion",
      "Sports & Apparel",
      "Technology"
    ],
    "count": 6
  }
}
```

---

### 4. Get Countries

**Endpoint:** `GET /api/countries`

**Example:**

```bash
curl https://your-api.onrender.com/api/countries
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-10-23T16:00:00.000Z",
  "data": {
    "countries": ["France", "Germany", "Italy", "Japan", "South Korea", "USA"],
    "count": 6
  }
}
```

---

## 🖼️ Static Files

Images, client files, and assets are served without the `/api` prefix:

```
https://your-api.onrender.com/images/logo.png
https://your-api.onrender.com/clients/3/india.png
https://your-api.onrender.com/assets/style.css
```

### Available Static Paths:

- `/images/` - General images and logos
- `/clients/` - Client-specific images and files
- `/assets/` - CSS, JS, and other static assets

---

## 🌐 Frontend Integration

### React Example

```jsx
const API_BASE = "https://your-api.onrender.com/api";

// Fetch all brands
const fetchBrands = async () => {
  const response = await fetch(`${API_BASE}/brands`);
  const data = await response.json();
  return JSON.parse(data.body).data.brands;
};

// Fetch specific brand
const fetchBrand = async (id) => {
  const response = await fetch(`${API_BASE}/brands/${id}`);
  const data = await response.json();
  return JSON.parse(data.body).data.brand;
};

// Fetch categories
const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/categories`);
  const data = await response.json();
  return JSON.parse(data.body).data.categories;
};
```

### JavaScript Example

```javascript
const API_BASE = "https://your-api.onrender.com/api";

// Get brands with filters
async function getBrands(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/brands?${params}`);
  const data = await response.json();
  return JSON.parse(data.body).data.brands;
}

// Usage
const techBrands = await getBrands({ category: "Technology" });
const usBrands = await getBrands({ country: "USA", limit: 5 });
```

### Vue.js Example

```vue
<template>
  <div>
    <h1>Brands Directory</h1>
    <div v-for="brand in brands" :key="brand.id">
      <h3>{{ brand.name }}</h3>
      <img
        :src="`${baseUrl}/images/${brand.name.toLowerCase()}-logo.png`"
        :alt="brand.name"
      />
      <p>{{ brand.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: "https://your-api.onrender.com",
      brands: [],
    };
  },
  async mounted() {
    const response = await fetch(`${this.baseUrl}/api/brands`);
    const data = await response.json();
    this.brands = JSON.parse(data.body).data.brands;
  },
};
</script>
```

---

## 🔧 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-10-23T16:00:00.000Z"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `404` - Not found (invalid endpoint or brand ID)
- `500` - Server error

---

## 🚀 Quick Start

1. **Test the API:**

   ```bash
   curl https://your-api.onrender.com/api/brands
   ```

2. **Get available endpoints:**

   ```bash
   curl https://your-api.onrender.com/api
   ```

3. **Filter brands:**

   ```bash
   curl "https://your-api.onrender.com/api/brands?category=Technology&limit=3"
   ```

4. **Access images:**
   ```bash
   curl https://your-api.onrender.com/images/logo.png
   ```

---

## 📊 Available Brands

| ID  | Name          | Category         | Country     | Founded |
| --- | ------------- | ---------------- | ----------- | ------- |
| 1   | Nike          | Sports & Apparel | USA         | 1964    |
| 2   | Adidas        | Sports & Apparel | Germany     | 1949    |
| 3   | Apple         | Technology       | USA         | 1976    |
| 4   | Samsung       | Technology       | South Korea | 1938    |
| 5   | Toyota        | Automotive       | Japan       | 1937    |
| 6   | Tesla         | Automotive       | USA         | 2003    |
| 7   | Coca-Cola     | Beverages        | USA         | 1892    |
| 8   | Starbucks     | Food & Beverage  | USA         | 1971    |
| 9   | Gucci         | Luxury Fashion   | Italy       | 1921    |
| 10  | Louis Vuitton | Luxury Fashion   | France      | 1854    |

---

**Your API is now properly structured with `/api` prefix! 🎉**
