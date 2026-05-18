import { runSignalDetection } from "./src/lib/core-intelligence/signals/index";
import { performance } from "perf_hooks";

// Mock data
const reviews = [];
for (let i = 0; i < 10000; i++) {
  reviews.push({
    id: `r${i}`,
    title: 'Test',
    rating: i % 2 === 0 ? 5 : 1,
    date: '2024-01-01',
    author: 'TestUser',
    verified: true,
    snippet: i % 2 === 0 ? 'This was terrible and awful. I hate it.' : 'This was excellent and amazing. I love it.',
    helpfulVotes: 0,
    rawHtml: ''
  });
}

// We just run signal detection, we know it calls detectSentimentMismatch
const start = performance.now();
for (let i = 0; i < 10; i++) {
  runSignalDetection(reviews);
}
const end = performance.now();
console.log(`Current: ${end - start}ms`);
