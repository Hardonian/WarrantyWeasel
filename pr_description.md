🧪 Testing improvement for degraded state history

🎯 **What:** The testing gap addressed
This PR addresses a missing test for the edge case where the `DEGRADED_STATE_HISTORY` array overflows its maximum capacity (`MAX_HISTORY` of 100) in `src/lib/core-intelligence/degradedState.ts`. The implementation logic includes a `shift()` operation when the length exceeds `MAX_HISTORY`, but this was not previously covered by tests.

📊 **Coverage:** What scenarios are now tested
A new test case, `'maintains history within MAX_HISTORY limit'`, has been added to `tests/core-intelligence/degradedState.test.ts`. This test verifies that after pushing 105 degraded state events, the history correctly maintains only the 100 most recent items (preventing unbounded memory growth) and properly removes the oldest items.

✨ **Result:** The improvement in test coverage
We now have full confidence that the internal `MAX_HISTORY` capping logic functions as intended, providing better safety for the codebase and ensuring stable memory usage in production environments when many degraded states occur.
