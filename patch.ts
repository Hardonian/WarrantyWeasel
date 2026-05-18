import * as fs from 'fs';

const filePath = 'src/lib/core-intelligence/signals/index.ts';
let code = fs.readFileSync(filePath, 'utf8');

const oldCode = `function detectSentimentMismatch(reviews: ParsedReview[]): SignalResult | null {
  const mismatches: { rating: number; snippet: string }[] = []

  for (const review of reviews) {
    const text = review.snippet.toLowerCase()
    const negativeWords = ['terrible', 'awful', 'worst', 'hate', 'broke', 'defective', 'waste', 'disappointing', 'garbage', 'useless']
    const positiveWords = ['excellent', 'amazing', 'love', 'great', 'perfect', 'best', 'wonderful', 'fantastic', 'outstanding']

    const negCount = negativeWords.filter((w) => text.includes(w)).length
    const posCount = positiveWords.filter((w) => text.includes(w)).length

    if (review.rating >= 4 && negCount >= 2) {
      mismatches.push({ rating: review.rating, snippet: review.snippet })
    } else if (review.rating <= 2 && posCount >= 2) {
      mismatches.push({ rating: review.rating, snippet: review.snippet })
    }
  }`;

const newCode = `const NEGATIVE_WORDS = ['terrible', 'awful', 'worst', 'hate', 'broke', 'defective', 'waste', 'disappointing', 'garbage', 'useless']
const POSITIVE_WORDS = ['excellent', 'amazing', 'love', 'great', 'perfect', 'best', 'wonderful', 'fantastic', 'outstanding']

function detectSentimentMismatch(reviews: ParsedReview[]): SignalResult | null {
  const mismatches: { rating: number; snippet: string }[] = []

  for (const review of reviews) {
    const text = review.snippet.toLowerCase()

    if (review.rating >= 4) {
      let negCount = 0
      for (let i = 0; i < NEGATIVE_WORDS.length; i++) {
        if (text.includes(NEGATIVE_WORDS[i])) {
          negCount++
          if (negCount >= 2) break
        }
      }
      if (negCount >= 2) {
        mismatches.push({ rating: review.rating, snippet: review.snippet })
        continue
      }
    }

    if (review.rating <= 2) {
      let posCount = 0
      for (let i = 0; i < POSITIVE_WORDS.length; i++) {
        if (text.includes(POSITIVE_WORDS[i])) {
          posCount++
          if (posCount >= 2) break
        }
      }
      if (posCount >= 2) {
        mismatches.push({ rating: review.rating, snippet: review.snippet })
      }
    }
  }`;

code = code.replace(oldCode, newCode);
fs.writeFileSync(filePath, code);
