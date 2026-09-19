# Repository Instructions

## Coding Standards

- Use ES6+ syntax and modern JavaScript conventions.
- Prefer explicit function declarations and descriptive variable names.
- Always include basic JSDoc comments for public functions.

## Guardrails

- NEVER commit secrets, API keys, or plain-text passwords.
- Always validate input arguments in exported functions.
- Do NOT modify configuration files unless explicitly asked.

# Code Review Guidelines

When reviewing Pull Requests, you must rigorously inspect code for the following:

1. **Security Vulnerabilities (CRITICAL):**
   - Identify any SQL Injection risks caused by string concatenation or template literals (`${...}`) in database queries.
   - Require parameterization (e.g., parameterized queries like `$1`, `$2`) for all SQL executions.

2. **Input Validation:**
   - Ensure all parameters (IDs, roles, inputs) are explicitly validated before processing.

3. **Reporting:**
   - If a function contains a vulnerability, you MUST flag the exact line and fail the check or leave an explicit review comment stating the flaw.
