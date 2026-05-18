# 🧪 Add tests for detectFailureType in fetchController.ts

## 🎯 What
The testing gap addressed was the lack of unit tests for the error paths in the `detectFailureType` pure function within `src/lib/scraper/fetchController.ts`. To make it testable, `detectFailureType` was exported, and a new test file `fetchController.test.ts` was added.

## 📊 Coverage
The following scenarios are now tested:
- HTTP 429 Status returning 'FS-01'
- HTTP 403 Status returning 'FS-05'
- HTTP 403 Status with WAF indicators returning 'FS-05'
- Valid HTTP 200 responses with CAPTCHA indicators returning 'FS-02'
- Valid HTTP 200 responses with JS challenge indicators returning 'FS-10'
- Valid HTTP 200 responses with Out of Stock indicators returning 'FS-04'
- HTTP 500+ Server Errors returning 'FS-50'
- Empty or short (< 500 chars) HTTP 200 responses returning 'FS-04'
- Valid HTTP 200 responses returning `null`

## ✨ Result
Test coverage for the fetching layer's failure detection mechanism is significantly improved, catching potential regressions around how failure scenarios and status codes map to specific failure types. All error paths within `detectFailureType` are now verified deterministically.
