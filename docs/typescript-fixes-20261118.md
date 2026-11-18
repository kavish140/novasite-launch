# TypeScript cleanup — 18 November 2026

The 60 previously recorded application diagnostics are resolved. `npm run typecheck` generates React Router route types, then checks application code and Vite configuration; both pass with zero errors.

Changes:

- Contextually checked Framer Motion configuration objects using `HTMLMotionProps` and `Variants`, including easing values, bezier tuples and viewport margins. Runtime animation values are unchanged.
- Removed three obsolete empty `projectImage` props from callers of the iframe-based portfolio template. The template does not consume that prop.
- Configured TypeScript's virtual root directories for React Router-generated route types, fixing blog and sitemap type imports.
- Added a repeatable package script for type generation and both compiler projects.

No compiler settings were loosened, checks excluded, packages changed or any/ignore suppressions added. The existing application's legacy non-strict options were left as-is; this is not a claim that the project was migrated to full strict mode.

Validation: zero diagnostics from both compiler projects, 387/387 unit tests, scoped lint and whitespace checks. Production build evidence: ignored `logs/type-fix-build.txt`. Prior blocker fixes and the verified portfolio migration remain intact. No push, website deployment, database or financial action in this pass.

Follow-up: the full-repository ESLint findings were subsequently resolved too; see [ESLint cleanup](lint-cleanup-20261118.md). Full lint and TypeScript checks now pass independently.
