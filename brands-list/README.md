# Brands List API

A RESTful API for managing and querying brand information with advanced filtering, pagination, and search capabilities.

## 🌟 Features

- **10 Popular Brands** across multiple categories
- **Advanced Filtering** by category, country
- **Search Functionality** across brand names and descriptions
- **Pagination Support** with customizable limits
- **Sorting Options** by name, founded year, or ID
- **REST API** with JSON responses

## 🚀 Live API Endpoints

### Get All Brands
```bash
curl https://your-app.onrender.com/
```

### Filter by Category
```bash
curl "https://your-app.onrender.com/?category=Technology"
```

### Filter by Country
```bash
curl "https://your-app.onrender.com/?country=USA"
```

### Search Brands
```bash
curl "https://your-app.onrender.com/?search=sport"
```

### Pagination
```bash
curl "https://your-app.onrender.com/?limit=5&offset=0"
```

### Combined Filters
```bash
curl "https://your-app.onrender.com/?category=Technology&country=USA&limit=3"
```

### Sort Results
```bash
curl "https://your-app.onrender.com/?sortBy=founded"
```

## 📊 Available Brands

| Brand | Category | Country | Founded |
|-------|----------|---------|---------|
| Nike | Sports & Apparel | USA | 1964 |
| Adidas | Sports & Apparel | Germany | 1949 |
| Apple | Technology | USA | 1976 |
| Samsung | Technology | South Korea | 1938 |
| Toyota | Automotive | Japan | 1937 |
| Tesla | Automotive | USA | 2003 |
| Coca-Cola | Beverages | USA | 1892 |
| Starbucks | Food & Beverage | USA | 1971 |
| Gucci | Luxury Fashion | Italy | 1921 |
| Louis Vuitton | Luxury Fashion | France | 1854 |

## 🔧 Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by brand category | `?category=Technology` |
| `country` | string | Filter by country | `?country=USA` |
| `search` | string | Search in name/description | `?search=sport` |
| `limit` | number | Results per page (default: 10) | `?limit=5` |
| `offset` | number | Skip N results (default: 0) | `?offset=5` |
| `sortBy` | string | Sort by: name, founded, id | `?sortBy=founded` |

## 📦 Response Format

```json
{
  "success": true,
  "timestamp": "2025-10-23T15:00:00.000Z",
  "data": {
    "brands": [...],
    "pagination": {
      "total": 10,
      "limit": 10,
      "offset": 0,
      "count": 10,
      "hasMore": false
    },
    "filters": {
      "applied": {...},
      "available": {...}
    }
  },
  "examples": {...}
}
```

## 🏃 Running Locally

### With Docker
```bash
docker build -t brands-list-api .
docker run -p 8080:8080 brands-list-api
```

### With Node.js
```bash
npm install
node index.js
```

### Test Locally
```bash
curl http://localhost:8080
```

## 🌐 Deploy to Production

See [DEPLOY_NOW.md](../DEPLOY_NOW.md) for step-by-step deployment instructions to:
- Render.com (Free, easiest)
- Railway (Free with GitHub)
- Fly.io (Free tier available)
- Google Cloud Run (Generous free tier)

## 🛠️ Tech Stack

- **Runtime**: Node.js 20
- **Framework**: OpenFaaS
- **Container**: Docker (Alpine Linux)
- **Deployment**: Cloud-native, serverless

## 📝 License

MIT

