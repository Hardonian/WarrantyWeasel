🧪 Add error path test for invalid JSON-LD

🎯 **What:** Added a test to verify that `parseJsonLd` correctly handles invalid JSON-LD in `src/lib/parsers/reviewParser.ts:68` by trying to parse subsequent JSON-LD scripts when the first one fails.

📊 **Coverage:** The test ensures the error path for `JSON.parse` handles bad JSON correctly and utilizes `continue` to attempt parsing the next script.

✨ **Result:** Test coverage improved and the edge case is officially verified.
