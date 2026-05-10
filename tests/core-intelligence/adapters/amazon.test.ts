import { describe, it, expect } from 'vitest'
import { amazonParse, amazonExtractCategory } from '@/lib/core-intelligence/adapters/amazon'

describe('amazon adapter', () => {
  describe('amazonParse', () => {
    it('parses valid product and reviews', () => {
      const html = `
        <html>
          <body>
            <h1 id="productTitle">Test Amazon Product</h1>
            <span id="acrPopover" title="4.5 out of 5 stars"></span>
            <span data-hook="total-review-count">1,234 global ratings</span>

            <div data-hook="review">
              <span class="a-profile-name">John Doe</span>
              <i data-hook="review-star-rating" class="a-star-5"><span>5.0 out of 5 stars</span></i>
              <span data-hook="review-title"><span>Great product!</span></span>
              <span data-hook="review-date">Reviewed in the United States on January 1, 2024</span>
              <span data-hook="avp-badge">Verified Purchase</span>
              <span data-hook="review-body"><span>I really loved this item.</span></span>
              <span data-hook="helpful-vote-statement">42 people found this helpful</span>
            </div>

            <div data-hook="review">
              <span class="a-profile-name">Jane Smith</span>
              <i data-hook="cmps-review-star-rating" class="a-star-2"><span>2.0 out of 5 stars</span></i>
              <span data-hook="review-title-content"><span>Not what I expected</span></span>
              <span data-hook="review-date">Reviewed in Canada on February 15, 2024</span>
              <span data-hook="review-body"><span>Quality is mediocre at best.</span></span>
            </div>
          </body>
        </html>
      `

      const result = amazonParse(html)

      expect(result.productName).toBe('Test Amazon Product')
      expect(result.averageRating).toBe(4.5)
      expect(result.totalReviews).toBe(1234)
      expect(result.reviews).toHaveLength(2)

      expect(result.reviews[0].author).toBe('John Doe')
      expect(result.reviews[0].rating).toBe(5)
      expect(result.reviews[0].title).toBe('Great product!')
      expect(result.reviews[0].date).toBe('January 1, 2024')
      expect(result.reviews[0].verified).toBe(true)
      expect(result.reviews[0].snippet).toBe('I really loved this item.')
      expect(result.reviews[0].helpfulVotes).toBe(42)

      expect(result.reviews[1].author).toBe('Jane Smith')
      expect(result.reviews[1].rating).toBe(2)
      expect(result.reviews[1].title).toBe('Not what I expected')
      expect(result.reviews[1].date).toBe('February 15, 2024')
      expect(result.reviews[1].verified).toBe(false)
      expect(result.reviews[1].snippet).toBe('Quality is mediocre at best.')
      expect(result.reviews[1].helpfulVotes).toBe(0)
    })

    it('handles empty html gracefully', () => {
      const result = amazonParse('')
      expect(result.productName).toBeNull()
      expect(result.averageRating).toBeNull()
      expect(result.totalReviews).toBeNull()
      expect(result.reviews).toEqual([])
    })

    it('falls back to alternative product title', () => {
      const html = `<html><head><meta property="og:title" content="Fallback Title"></head><body></body></html>`
      const result = amazonParse(html)
      expect(result.productName).toBe('Fallback Title')
    })

    it('limits parsed reviews to 100', () => {
      let html = '<html><body>'
      for (let i = 0; i < 150; i++) {
        html += `
          <div data-hook="review">
            <span data-hook="review-title"><span>Review ${i}</span></span>
          </div>
        `
      }
      html += '</body></html>'

      const result = amazonParse(html)
      expect(result.reviews).toHaveLength(100)
    })
  })

  describe('amazonExtractCategory', () => {
    it('detects electronics', () => {
      expect(amazonExtractCategory('Apple phone 15 Pro', 'phone 15 Pro')).toBe('electronics')
      expect(amazonExtractCategory('usb c charger cable', null)).toBe('electronics')
    })

    it('detects tools', () => {
      expect(amazonExtractCategory('DeWalt 20V Max Drill', null)).toBe('tools')
      expect(amazonExtractCategory('Socket wrench set', null)).toBe('tools')
    })

    it('detects general when no match', () => {
      expect(amazonExtractCategory('Some random weird stuff', 'Weird Stuff')).toBe('general')
    })
  })
})
