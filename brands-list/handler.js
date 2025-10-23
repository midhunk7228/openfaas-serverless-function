"use strict";

// Sample brands database
const BRANDS_DATABASE = [
  {
    id: 1,
    name: "Nike",
    category: "Sports & Apparel",
    country: "USA",
    founded: 1964,
    description: "Athletic footwear and apparel",
    website: "https://www.nike.com",
  },
  {
    id: 2,
    name: "Adidas",
    category: "Sports & Apparel",
    country: "Germany",
    founded: 1949,
    description: "Sports equipment and apparel",
    website: "https://www.adidas.com",
  },
  {
    id: 3,
    name: "Apple",
    category: "Technology",
    country: "USA",
    founded: 1976,
    description: "Consumer electronics and software",
    website: "https://www.apple.com",
  },
  {
    id: 4,
    name: "Samsung",
    category: "Technology",
    country: "South Korea",
    founded: 1938,
    description: "Electronics and technology",
    website: "https://www.samsung.com",
  },
  {
    id: 5,
    name: "Toyota",
    category: "Automotive",
    country: "Japan",
    founded: 1937,
    description: "Automobile manufacturing",
    website: "https://www.toyota.com",
  },
  {
    id: 6,
    name: "Tesla",
    category: "Automotive",
    country: "USA",
    founded: 2003,
    description: "Electric vehicles and clean energy",
    website: "https://www.tesla.com",
  },
  {
    id: 7,
    name: "Coca-Cola",
    category: "Beverages",
    country: "USA",
    founded: 1892,
    description: "Soft drinks and beverages",
    website: "https://www.coca-cola.com",
  },
  {
    id: 8,
    name: "Starbucks",
    category: "Food & Beverage",
    country: "USA",
    founded: 1971,
    description: "Coffee chain and roastery",
    website: "https://www.starbucks.com",
  },
  {
    id: 9,
    name: "Gucci",
    category: "Luxury Fashion",
    country: "Italy",
    founded: 1921,
    description: "Luxury fashion and leather goods",
    website: "https://www.gucci.com",
  },
  {
    id: 10,
    name: "Louis Vuitton",
    category: "Luxury Fashion",
    country: "France",
    founded: 1854,
    description: "Luxury fashion and leather goods",
    website: "https://www.louisvuitton.com",
  },
];

module.exports = async (event, context) => {
  try {
    // Handle different API endpoints
    const path = event.path || "/";

    // Route: /api/brands (or just /api/)
    if (path === "/" || path === "/brands") {
      return await handleBrandsList(event, context);
    }

    // Route: /api/brands/:id
    if (path.startsWith("/brands/")) {
      const brandId = path.split("/")[2];
      return await handleSingleBrand(brandId, context);
    }

    // Route: /api/categories
    if (path === "/categories") {
      return await handleCategories(context);
    }

    // Route: /api/countries
    if (path === "/countries") {
      return await handleCountries(context);
    }

    // Route: /api/header-menu
    if (path === "/header-menu") {
      return await handleHeaderMenu(context);
    }

    // Default: return available endpoints
    const result = {
      body: JSON.stringify(
        {
          success: true,
          message: "OpenFaaS Brands API",
          timestamp: new Date().toISOString(),
          availableEndpoints: {
            "GET /api/brands": "Get all brands with filtering",
            "GET /api/brands/:id": "Get specific brand by ID",
            "GET /api/categories": "Get all available categories",
            "GET /api/countries": "Get all available countries",
            "GET /api/header-menu": "Get header menu items",
          },
          examples: {
            "All brands": "/api/brands",
            "Technology brands": "/api/brands?category=Technology",
            "USA brands": "/api/brands?country=USA",
            "Search Nike": "/api/brands?search=nike",
            "Brand by ID": "/api/brands/1",
            Categories: "/api/categories",
            Countries: "/api/countries",
          },
        },
        null,
        2
      ),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
};

// Handle header menu endpoint
async function handleHeaderMenu(context) {
  try {
    const menuItems = [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "home",
      },
      {
        id: 2,
        title: "Brands",
        url: "/brands",
        icon: "brand",
      },
      {
        id: 3,
        title: "Categories",
        url: "/categories",
        icon: "category",
      },
      {
        id: 4,
        title: "About",
        url: "/about",
        icon: "info",
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        icon: "contact",
      },
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        menuItems: menuItems,
        count: menuItems.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle brands list endpoint
async function handleBrandsList(event, context) {
  try {
    // Get query parameters
    const query = event.query || {};
    const category = query.category;
    const country = query.country;
    const search = query.search?.toLowerCase();
    const limit = parseInt(query.limit) || 10;
    const offset = parseInt(query.offset) || 0;
    const sortBy = query.sortBy || "name"; // name, founded, id

    // Filter brands based on query parameters
    let filteredBrands = [...BRANDS_DATABASE];

    // Filter by category
    if (category) {
      filteredBrands = filteredBrands.filter(
        (brand) => brand.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by country
    if (country) {
      filteredBrands = filteredBrands.filter(
        (brand) => brand.country.toLowerCase() === country.toLowerCase()
      );
    }

    // Search in name or description
    if (search) {
      filteredBrands = filteredBrands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(search) ||
          brand.description.toLowerCase().includes(search)
      );
    }

    // Sort brands
    filteredBrands.sort((a, b) => {
      if (sortBy === "founded") {
        return a.founded - b.founded;
      } else if (sortBy === "id") {
        return a.id - b.id;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    // Get total count before pagination
    const totalCount = filteredBrands.length;

    // Apply pagination
    const paginatedBrands = filteredBrands.slice(offset, offset + limit);

    // Get unique categories for filtering
    const categories = [
      ...new Set(BRANDS_DATABASE.map((b) => b.category)),
    ].sort();
    const countries = [
      ...new Set(BRANDS_DATABASE.map((b) => b.country)),
    ].sort();

    // Build response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        brands: paginatedBrands,
        pagination: {
          total: totalCount,
          limit: limit,
          offset: offset,
          count: paginatedBrands.length,
          hasMore: offset + limit < totalCount,
        },
        filters: {
          applied: {
            category: category || null,
            country: country || null,
            search: search || null,
          },
          available: {
            categories: categories,
            countries: countries,
          },
        },
      },
      examples: {
        filterByCategory: "/api/brands?category=Technology",
        filterByCountry: "/api/brands?country=USA",
        search: "/api/brands?search=sport",
        pagination: "/api/brands?limit=5&offset=0",
        combined: "/api/brands?category=Technology&country=USA&limit=3",
        sort: "/api/brands?sortBy=founded",
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle header menu endpoint
async function handleHeaderMenu(context) {
  try {
    const menuItems = [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "home",
      },
      {
        id: 2,
        title: "Brands",
        url: "/brands",
        icon: "brand",
      },
      {
        id: 3,
        title: "Categories",
        url: "/categories",
        icon: "category",
      },
      {
        id: 4,
        title: "About",
        url: "/about",
        icon: "info",
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        icon: "contact",
      },
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        menuItems: menuItems,
        count: menuItems.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle single brand by ID
async function handleSingleBrand(brandId, context) {
  try {
    const id = parseInt(brandId);
    const brand = BRANDS_DATABASE.find((b) => b.id === id);

    if (!brand) {
      const result = {
        body: JSON.stringify(
          {
            success: false,
            error: "Brand not found",
            message: `No brand found with ID ${brandId}`,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
        "content-type": "application/json",
      };

      return context.status(404).succeed(result);
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        brand: brand,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle header menu endpoint
async function handleHeaderMenu(context) {
  try {
    const menuItems = [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "home",
      },
      {
        id: 2,
        title: "Brands",
        url: "/brands",
        icon: "brand",
      },
      {
        id: 3,
        title: "Categories",
        url: "/categories",
        icon: "category",
      },
      {
        id: 4,
        title: "About",
        url: "/about",
        icon: "info",
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        icon: "contact",
      },
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        menuItems: menuItems,
        count: menuItems.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle categories endpoint
async function handleCategories(context) {
  try {
    const categories = [
      ...new Set(BRANDS_DATABASE.map((b) => b.category)),
    ].sort();

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        categories: categories,
        count: categories.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle header menu endpoint
async function handleHeaderMenu(context) {
  try {
    const menuItems = [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "home",
      },
      {
        id: 2,
        title: "Brands",
        url: "/brands",
        icon: "brand",
      },
      {
        id: 3,
        title: "Categories",
        url: "/categories",
        icon: "category",
      },
      {
        id: 4,
        title: "About",
        url: "/about",
        icon: "info",
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        icon: "contact",
      },
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        menuItems: menuItems,
        count: menuItems.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle countries endpoint
async function handleCountries(context) {
  try {
    const countries = [
      ...new Set(BRANDS_DATABASE.map((b) => b.country)),
    ].sort();

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        countries: countries,
        count: countries.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}

// Handle header menu endpoint
async function handleHeaderMenu(context) {
  try {
    const menuItems = [
      {
        id: 1,
        title: "Home",
        url: "/",
        icon: "home",
      },
      {
        id: 2,
        title: "Brands",
        url: "/brands",
        icon: "brand",
      },
      {
        id: 3,
        title: "Categories",
        url: "/categories",
        icon: "category",
      },
      {
        id: 4,
        title: "About",
        url: "/about",
        icon: "info",
      },
      {
        id: 5,
        title: "Contact",
        url: "/contact",
        icon: "contact",
      },
    ];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        menuItems: menuItems,
        count: menuItems.length,
      },
    };

    const result = {
      body: JSON.stringify(response, null, 2),
      "content-type": "application/json",
    };

    return context.status(200).succeed(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    const result = {
      body: JSON.stringify(errorResponse, null, 2),
      "content-type": "application/json",
    };

    return context.status(500).succeed(result);
  }
}
