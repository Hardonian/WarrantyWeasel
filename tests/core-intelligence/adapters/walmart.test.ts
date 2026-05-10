import { describe, it, expect } from 'vitest'
import { walmartParse, walmartExtractCategory } from '@/lib/core-intelligence/adapters/walmart'

describe('walmartParse', () => {
  it('parses product info correctly', () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Meta Product" />
        </head>
        <body>
          <h1 class="prod-ProductTitle">Test Product</h1>
          <span itemprop="ratingValue" content="4.5"></span>
          <span itemprop="reviewCount" content="100"></span>
        </body>
      </html>
    `
    const result = walmartParse(html)
    expect(result.productName).toBe('Test Product')
    expect(result.averageRating).toBe(4.5)
    expect(result.totalReviews).toBe(100)
    expect(result.reviews).toHaveLength(0)
  })

  it('falls back to meta title if h1 is missing', () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Meta Product" />
        </head>
        <body>
        </body>
      </html>
    `
    const result = walmartParse(html)
    expect(result.productName).toBe('Meta Product')
  })

  it('parses reviews with data-testid="customer-review"', () => {
    const html = `
      <html>
        <body>
          <div data-testid="customer-review">
            <span itemprop="ratingValue" content="5.0"></span>
            <h3 data-testid="review-title">Great item</h3>
            <span itemprop="datePublished" content="2023-01-01"></span>
            <span itemprop="author">John Doe</span>
            <span class="verified-purchase">Verified Purchaser</span>
            <p itemprop="reviewBody">Works as expected.</p>
            <span class="helpful-count">15 people found this helpful</span>
          </div>
        </body>
      </html>
    `
    const result = walmartParse(html)
    expect(result.reviews).toHaveLength(1)
    expect(result.reviews[0]).toMatchObject({
      title: 'Great item',
      rating: 5,
      date: '2023-01-01',
      author: 'John Doe',
      verified: true,
      snippet: 'Works as expected.',
      helpfulVotes: 15,
    })
  })

  it('parses reviews with fallback selectors', () => {
    const html = `
      <html>
        <body>
          <div class="review-item">
            <h3 class="review-title">Good</h3>
            <span class="review-date">Oct 10, 2023</span>
            <span class="reviewer-name">Jane</span>
            <span>Verified purchaser</span>
            <p class="review-text">I like it.</p>
          </div>
        </body>
      </html>
    `
    const result = walmartParse(html)
    expect(result.reviews).toHaveLength(1)
    expect(result.reviews[0]).toMatchObject({
      title: 'Good',
      rating: 0,
      date: 'Oct 10, 2023',
      author: 'Jane',
      verified: true,
      snippet: 'I like it.',
      helpfulVotes: 0,
    })
  })

  it('handles missing or malformed review data gracefully', () => {
    const html = `
      <html>
        <body>
          <div class="bg-white border-bottom">
          </div>
        </body>
      </html>
    `
    const result = walmartParse(html)
    // No title or snippet, should not be added to reviews
    expect(result.reviews).toHaveLength(0)
  })

  it('extracts categories correctly', () => {
    expect(walmartExtractCategory('some html about a laptop', 'Dell Laptop')).toBe('electronics')
    expect(walmartExtractCategory('drill press', null)).toBe('tools')
    expect(walmartExtractCategory('nice cotton shirts', null)).toBe('apparel')
    expect(walmartExtractCategory('wooden furniture', null)).toBe('home_goods')
    expect(walmartExtractCategory('video games', null)).toBe('digital')
    expect(walmartExtractCategory('vitamin c', null)).toBe('food_supplement')
    expect(walmartExtractCategory('synthetic motor oil', null)).toBe('automotive')
    expect(walmartExtractCategory('random stuff', null)).toBe('general')
  })

  it('handles empty html', () => {
    const result = walmartParse('')
    expect(result.productName).toBeNull()
    expect(result.averageRating).toBeNull()
    expect(result.totalReviews).toBeNull()
    expect(result.reviews).toHaveLength(0)
    expect(result.category).toBe('general')
  })
})
