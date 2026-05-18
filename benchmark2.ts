import { performance } from "perf_hooks";

const reviews: any[] = [];
for (let i = 0; i < 10000; i++) {
  reviews.push({
    rating: i % 2 === 0 ? 5 : 1,
    snippet: i % 2 === 0 ? 'This was terrible and awful. I hate it.' : 'This was excellent and amazing. I love it.',
  });
}

function currentDetect(reviews: any[]) {
    let matches = 0;
    for (const review of reviews) {
        const text = review.snippet.toLowerCase()
        const negativeWords = ['terrible', 'awful', 'worst', 'hate', 'broke', 'defective', 'waste', 'disappointing', 'garbage', 'useless']
        const positiveWords = ['excellent', 'amazing', 'love', 'great', 'perfect', 'best', 'wonderful', 'fantastic', 'outstanding']

        const negCount = negativeWords.filter((w) => text.includes(w)).length
        const posCount = positiveWords.filter((w) => text.includes(w)).length

        if (review.rating >= 4 && negCount >= 2) {
            matches++;
        } else if (review.rating <= 2 && posCount >= 2) {
            matches++;
        }
    }
    return matches;
}

function optimizedDetect(reviews: any[]) {
    let matches = 0;
    // Lift array allocations outside loop
    const negativeWords = ['terrible', 'awful', 'worst', 'hate', 'broke', 'defective', 'waste', 'disappointing', 'garbage', 'useless'];
    const positiveWords = ['excellent', 'amazing', 'love', 'great', 'perfect', 'best', 'wonderful', 'fantastic', 'outstanding'];

    for (const review of reviews) {
        const text = review.snippet.toLowerCase();

        if (review.rating >= 4) {
            let negCount = 0;
            for (let i = 0; i < negativeWords.length; i++) {
                if (text.includes(negativeWords[i])) {
                    negCount++;
                    if (negCount >= 2) break; // early exit
                }
            }
            if (negCount >= 2) {
                matches++;
                continue;
            }
        }

        if (review.rating <= 2) {
            let posCount = 0;
            for (let i = 0; i < positiveWords.length; i++) {
                if (text.includes(positiveWords[i])) {
                    posCount++;
                    if (posCount >= 2) break; // early exit
                }
            }
            if (posCount >= 2) {
                matches++;
            }
        }
    }
    return matches;
}

const iters = 1000;

console.log("Warming up...");
currentDetect(reviews);
optimizedDetect(reviews);

console.log("Running Current...");
const start1 = performance.now();
for (let i = 0; i < iters; i++) {
    currentDetect(reviews);
}
const end1 = performance.now();
const t1 = end1 - start1;

console.log("Running Optimized...");
const start2 = performance.now();
for (let i = 0; i < iters; i++) {
    optimizedDetect(reviews);
}
const end2 = performance.now();
const t2 = end2 - start2;

console.log(`Current: ${t1.toFixed(2)}ms`);
console.log(`Optimized: ${t2.toFixed(2)}ms`);
console.log(`Improvement: ${((t1 - t2) / t1 * 100).toFixed(2)}%`);
