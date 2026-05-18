🎯 **What:** The testing gap addressed was that `detectFailureType` in `src/lib/scraper/fetchController.ts` was not tested, especially the check for empty 200 responses (where `status === 200` and `html.length < 500`).

📊 **Coverage:** Scenarios tested include:
  * Empty 200 responses (`html.length < 500`).
  * Normal 200 responses (`html.length >= 500`).
  * 429 status code handling.
  * 500 status code handling.
  * The e2e `fetchController` path to simulate an empty 200 response and check the degraded fetch result.

✨ **Result:** Test coverage for `detectFailureType` has been established, ensuring the check correctly catches and handles responses that are inappropriately sized, reducing regression risk.
