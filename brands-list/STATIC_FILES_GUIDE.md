# Static Files & Images Guide

Your API now supports serving static files like images!

## 📁 Folder Structure

```
brands-list/
├── images/          ← Place images here
│   └── logo.png
├── assets/          ← Place other files here
│   └── styles.css
├── handler.js
├── index.js
└── package.json
```

## 🖼️ How to Add Images

### 1. Add Image Files

Place your images in the `images/` folder:

```bash
# Example: Copy an image
cp ~/Downloads/nike-logo.png /Users/user/exthgen/openfaas/brands-list/images/
```

### 2. Access from Frontend

Your images will be accessible at:

```
https://your-api.onrender.com/images/nike-logo.png
```

## 🌐 Frontend Integration

### HTML

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Brand Logos</h1>
    <img
      src="https://your-api.onrender.com/images/nike-logo.png"
      alt="Nike Logo"
      width="200"
    />
  </body>
</html>
```

### React

```jsx
function BrandLogo({ brandName }) {
  const API_URL = "https://your-api.onrender.com";

  return (
    <img
      src={`${API_URL}/images/${brandName}-logo.png`}
      alt={`${brandName} Logo`}
      style={{ width: "200px" }}
    />
  );
}
```

### Vue

```vue
<template>
  <div>
    <img :src="`${apiUrl}/images/nike-logo.png`" alt="Nike Logo" width="200" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: "https://your-api.onrender.com",
    };
  },
};
</script>
```

### JavaScript (Fetch)

```javascript
const API_URL = "https://your-api.onrender.com";

// Fetch brands data
fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    data.brands.forEach((brand) => {
      const img = document.createElement("img");
      img.src = `${API_URL}/images/${brand.name.toLowerCase()}-logo.png`;
      document.body.appendChild(img);
    });
  });
```

## 📦 Supported File Types

### Images

- `.jpg`, `.jpeg` → `image/jpeg`
- `.png` → `image/png`
- `.gif` → `image/gif`
- `.svg` → `image/svg+xml`
- `.webp` → `image/webp`
- `.ico` → `image/x-icon`

### Other Assets

- `.json` → `application/json`
- `.css` → `text/css`
- `.js` → `text/javascript`
- `.html` → `text/html`

## 🎯 URL Structure

| File Location            | Public URL                                    |
| ------------------------ | --------------------------------------------- |
| `images/logo.png`        | `https://your-api.com/images/logo.png`        |
| `images/brands/nike.jpg` | `https://your-api.com/images/brands/nike.jpg` |
| `assets/style.css`       | `https://your-api.com/assets/style.css`       |

## 🔒 CORS Enabled

The server automatically includes CORS headers, so images can be loaded from any frontend domain:

```
Access-Control-Allow-Origin: *
```

## ⚡ Performance Features

- **Caching**: Images cached for 1 year (`Cache-Control: public, max-age=31536000`)
- **Optimized**: Direct file serving with proper MIME types
- **CDN-Ready**: Works with CDN caching

## 📝 Example: Complete Integration

### Backend (Your API)

```
brands-list/
├── images/
│   ├── nike-logo.png
│   ├── apple-logo.png
│   └── tesla-logo.png
```

### Frontend (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Brands Directory</title>
  </head>
  <body>
    <h1>Top Brands</h1>
    <div id="brands"></div>

    <script>
      const API_URL = "https://brands-list-api.onrender.com";

      // Fetch brands
      fetch(API_URL)
        .then((res) => res.json())
        .then((response) => {
          const brands = JSON.parse(response.body).data.brands;
          const container = document.getElementById("brands");

          brands.forEach((brand) => {
            const div = document.createElement("div");
            div.innerHTML = `
            <h3>${brand.name}</h3>
            <img src="${API_URL}/images/${brand.name.toLowerCase()}-logo.png" 
                 alt="${brand.name}"
                 width="100"
                 onerror="this.src='${API_URL}/images/default.png'">
            <p>${brand.description}</p>
          `;
            container.appendChild(div);
          });
        });
    </script>
  </body>
</html>
```

## 🚀 Deploy Images

### After adding images:

```bash
cd /Users/user/exthgen/openfaas
git add brands-list/images/
git commit -m "Add brand logos"
git push origin master
```

Render will automatically redeploy with your images!

## 🧪 Test Locally

```bash
# Start server
cd brands-list
node index.js

# In browser or curl:
curl http://localhost:3000/images/your-image.png

# Or open in browser:
# http://localhost:3000/images/your-image.png
```

## 💡 Pro Tips

1. **Optimize Images**: Use compressed images (WebP format recommended)
2. **Naming Convention**: Use lowercase with hyphens (e.g., `nike-logo.png`)
3. **Fallback**: Always provide a default image for missing logos
4. **Size**: Keep images under 500KB for fast loading
5. **Dimensions**: Use consistent sizes (e.g., 200x200px for logos)

## 🔗 Related Endpoints

- **API Data**: `GET /` or `GET /?category=Technology`
- **Images**: `GET /images/filename.ext`
- **Assets**: `GET /assets/filename.ext`

---

Your API is now a full static file server + REST API! 🎉
