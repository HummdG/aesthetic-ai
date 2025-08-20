# Products Capability Documentation

## Overview

The products capability provides intelligent skincare product matching based on ingredient requirements, with live verification of availability and pricing. The system supports multiple retailers and uses advanced ingredient normalisation with alias matching.

## Features

- **Ingredient-based matching**: Find products containing required ingredients while avoiding unwanted ones
- **Intelligent scoring**: Products scored by ingredient position, freshness, price efficiency, and retailer reputation
- **Live verification**: Real-time price and availability checking with caching
- **Alias support**: Recognises ingredient aliases (e.g., niacinamide = vitamin B3)
- **Multi-retailer**: Supports Amazon (via Rainforest API) and Boots (web scraping)

## API Endpoint

### POST /api/v1/products/match

Find skincare products matching your ingredient requirements.

**Request Body:**

```json
{
  "country": "GB",
  "location": {
    "postcode": "SW1A 1AA"
  },
  "required_ingredients": ["niacinamide", "hyaluronic acid"],
  "avoid_ingredients": ["retinol", "salicylic acid"],
  "max_price": 25.0,
  "currency": "GBP"
}
```

**Response:**

```json
{
  "generated_at": "2024-01-15T10:30:00Z",
  "currency": "GBP",
  "results": [
    {
      "id": "uuid",
      "retailer": "boots",
      "retailer_sku": "12345",
      "brand": "The Ordinary",
      "name": "Niacinamide 10% + Zinc 1%",
      "country": "GB",
      "currency": "GBP",
      "price": 6.7,
      "price_per_ml": 0.22,
      "formatted_price": "£6.70",
      "pdp_url": "https://www.boots.com/product/12345",
      "image_url": "https://example.com/image.jpg",
      "ingredients_normalised": [
        "niacinamide",
        "zinc oxide",
        "hyaluronic acid"
      ],
      "availability": "in_stock",
      "score": 85.5,
      "last_verified": "2024-01-15T10:25:00Z"
    }
  ]
}
```

### GET /api/v1/products/health

Check the health status of the product matching service.

## Environment Variables

Add these environment variables to your `.env` file:

```bash
# Required for Amazon product search (optional but recommended)
RAINFOREST_API_KEY=your_rainforest_api_key_here

# Amazon domain to search (default: amazon.co.uk)
AMAZON_DOMAIN=amazon.co.uk

# Product matching configuration
TOP_N_LIVE_CHECK=20                    # Max products to live verify (default: 20)
LIVE_CHECK_TIMEOUT_SECONDS=8          # Timeout for live checks (default: 8)
COUNTRY_WHITELIST=GB                   # Supported countries (default: GB)

# Optional Redis cache for live verification results
REDIS_URL=redis://localhost:6379      # Optional, improves performance
```

## Supported Countries

Currently supported:

- **GB**: United Kingdom (Boots, Amazon UK)

The system can be extended to support additional countries by:

1. Adding new retailer adapters
2. Updating `COUNTRY_WHITELIST`
3. Adding country-specific currency mappings

## Retailer Adapters

### Amazon (via Rainforest API)

- **Requirements**: `RAINFOREST_API_KEY` environment variable
- **Coverage**: Global Amazon domains
- **Rate limiting**: 5 concurrent requests, 200ms intervals
- **Features**: Product search, PDP parsing, live price checking

### Boots UK (Web Scraping)

- **Requirements**: None (uses web scraping)
- **Coverage**: UK only
- **Rate limiting**: 3 concurrent requests, 1s intervals
- **Features**: Product search, ingredient parsing, availability checking

## Ingredient Normalisation

The system includes comprehensive ingredient normalisation with:

### Supported Aliases

- **Niacinamide**: nicotinamide, vitamin B3, vitamin B-3
- **Salicylic Acid**: BHA, beta hydroxy acid
- **Vitamin C**: ascorbic acid, L-ascorbic acid, MAP, SAP
- **Retinol**: vitamin A, retinyl palmitate, retinyl acetate
- **Hyaluronic Acid**: sodium hyaluronate, HA, hyaluronan
- **AHA**: glycolic acid, lactic acid, mandelic acid
- **Ceramides**: ceramide NP, ceramide AP, ceramide EOP
- And many more...

### Fuzzy Matching

- Uses RapidFuzz with 88% similarity threshold
- Handles common misspellings and variations
- Case-insensitive matching

## Database Schema

### Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    retailer TEXT NOT NULL,
    retailer_sku TEXT NOT NULL,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    country CHAR(2) NOT NULL,
    currency TEXT NOT NULL,
    price NUMERIC(10,2),
    price_per_ml NUMERIC(10,4),
    pdp_url TEXT NOT NULL,
    image_url TEXT,
    gtin TEXT,
    ingredients_raw TEXT NOT NULL,
    ingredients_norm TEXT[] NOT NULL,      -- Ordered INCI tokens
    ingredients_norm_set TEXT[] NOT NULL,  -- Unique tokens for search
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    last_live_verified TIMESTAMPTZ,
    tsv TSVECTOR,                         -- Full-text search
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    UNIQUE(retailer, retailer_sku)
);

-- Indices for performance
CREATE INDEX idx_products_ingredients_gin ON products USING gin(ingredients_norm_set);
CREATE INDEX idx_products_tsv_gin ON products USING gin(tsv);
CREATE INDEX idx_products_country ON products(country);
CREATE INDEX idx_products_last_seen ON products(last_seen);
```

### Live Snapshots Table (Audit Trail)

```sql
CREATE TABLE live_snapshots (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    price NUMERIC(10,2),
    currency TEXT,
    in_stock VARCHAR(50),
    deliverable_postcode VARCHAR(20),
    ingredients_raw TEXT,
    status_code VARCHAR(10),
    source VARCHAR(50) NOT NULL
);
```

## Caching Strategy

The system uses Redis for caching live verification results:

- **Cache Key Format**: `live:{retailer}:{sku}:{postcode}`
- **Cache Duration**: 15 minutes
- **Fallback**: Falls back to database `last_live_verified` (24 hour window)
- **Performance**: Reduces API calls and improves response times

## Scoring Algorithm

Products are scored using multiple factors:

1. **Ingredient Position** (max 50 points)

   - Earlier positions in INCI list score higher
   - Ignores "water" (always first)
   - Considers all required ingredients

2. **Freshness** (max 20 points)

   - Based on `last_seen` timestamp
   - 30-day sliding scale

3. **Price Efficiency** (max 20 points)

   - Inverse of `price_per_ml`
   - Rewards better value products

4. **Retailer Reputation** (max 10 points)
   - Boots: 10 points
   - Amazon: 8 points
   - Others: 5+ points

## Performance Considerations

- **Database Indices**: GIN indices on ingredient arrays for fast filtering
- **Concurrent Live Checks**: Async verification of top N products
- **Rate Limiting**: Respectful crawling with backoff
- **Caching**: Redis cache reduces external API calls
- **Timeouts**: Configurable timeouts prevent hanging requests

## Migration

To add the product tables to your database:

```bash
# Generate migration
python create_product_migration.py

# Apply migration
alembic upgrade head
```

## Testing

Run the ingredient normalisation tests:

```bash
cd backend
python test_products.py
```

## Usage Examples

### Basic Product Search

```python
from app.services.product_service import product_service
from app.models.schemas import ProductMatchRequest

request = ProductMatchRequest(
    country="GB",
    required_ingredients=["niacinamide", "hyaluronic acid"],
    avoid_ingredients=["retinol"],
    max_price=30.0
)

response = await product_service.match_products(request, db)
```

### With Location-Based Delivery

```python
request = ProductMatchRequest(
    country="GB",
    location={"postcode": "M1 1AA"},
    required_ingredients=["vitamin c", "ceramides"],
    currency="GBP"
)
```

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: 400 status with detailed messages
- **Service Unavailable**: Graceful degradation when APIs are down
- **Rate Limiting**: Automatic backoff and retry
- **Database Errors**: Transaction rollback and logging
- **Network Timeouts**: Configurable timeouts with fallbacks

## British English

All API responses use British English spelling and terminology:

- "colour" not "color"
- "moisturiser" not "moisturizer"
- Prices in pounds sterling (£)
- British postcode format support
