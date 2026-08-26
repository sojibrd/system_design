# MANDATORY CONTEXT LOADING — Read Before Anything Else

> **CRITICAL**: At the start of EVERY conversation, you MUST read ALL the following context files in the exact sequence listed below. Do not skip any file. Do not reorder. Do not respond to the user until all files have been fully read and internalized.

## Required Reading Sequence

| #   | File                                               | Purpose                                             |
| --- | -------------------------------------------------- | --------------------------------------------------- |
| 1   | [project-overview.md](context/project-overview.md) | Project goals, scope, and high-level architecture   |
| 2   | [build-plan.md](context/build-plan.md)             | Current build roadmap and implementation phases     |
| 3   | [progress-tracker.md](context/progress-tracker.md) | What has been done, what is pending, current status |
| 4   | [ui-tokens.md](context/ui-tokens.md)               | Design tokens — colors, spacing, typography system  |
| 5   | [ui-rules.md](context/ui-rules.md)                 | UI/UX rules and component usage guidelines          |
| 6   | [ui-registry.md](context/ui-registry.md)           | Registry of all existing UI components              |

### Content Rules & Structure
- `docs/` ফোল্ডারে ২৫টি রোডম্যাপ ডক (`01-introduction.md` ... `25-security.md` + `README.md`)
- `designs/` এবং `context/` ফোল্ডার বিল্ড স্ক্যানার (`content.ts`)-এ ইচ্ছাকৃতভাবে ইগনোর করা থাকে।
- `app/lib/content.ts` সম্পূর্ণ Server-only। ক্লায়েন্ট কম্পোনেন্ট থেকে কখনো ইম্পোর্ট করবেন না।

# Invariants

- Always give response in bangla.
- Strictly adhere to the project architecture, design tokens, and Next.js 16 conventions.
