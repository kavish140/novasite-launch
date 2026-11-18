# ESLint cleanup — 18 November 2026

The previously reported full-repository ESLint findings are resolved. `npm run lint` passes with no errors or warnings.

- Generated framework/runtime output and test reports are excluded from lint, rather than linting dependencies embedded in temporary bundles. Application code and tests remain included.
- Lead/quote selection uses explicit if/else, preserving the previous Set membership toggle.
- Quote sort comparison variables use const.
- Topic fetching is memoized with useCallback and referenced in its effect dependencies; the Supabase query and permissions are unchanged.
- Analytics retains the documented Google command queue format. A single prefer-rest-params exception is explained next to the queue operation rather than disabling the rule for the file or repository. Google's documented stub queues an Arguments object: https://developers.google.com/tag-platform/tag-manager/datalayer. Tests verify that exact shape and queued payloads without sending data.

Checks: full repository lint passes, both TypeScript compiler projects pass, and all 390 unit tests pass. Production build evidence is in ignored `logs/lint-fix-build.txt`. The source cleanup does not deploy the website or modify production services.

Evidence: ignored `logs/lint-fix-full.txt`, `logs/lint-fix-types.txt`, `logs/lint-fix-vitest.json` and `logs/lint-fix-build.txt`.
