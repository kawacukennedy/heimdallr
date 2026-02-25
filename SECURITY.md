# Security Policy

## Supported Versions

Currently, Heimdallr is in initial release. The `main` branch is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

We take the security of Heimdallr seriously. If you have discovered a security vulnerability in this project, please report it privately. **Do not create a public GitHub issue.**

### How to Report
Please open a security advisory draft via GitHub's "Security" tab on this repository, or report it privately to the repository owner if an email is provided in their GitHub profile.

### Triage Process
1. We will acknowledge receipt of your vulnerability report within 48 hours.
2. We will investigate the issue and determine if it is a valid security vulnerability.
3. If valid, we will work on a patch and release a security update.
4. We will publicly acknowledge your contribution in the release notes when the vulnerability is patched.

### Best Practices Enforced
- The `backend` uses `helmet` for HTTP headers.
- Rate limiting is applied to all backend API routes via `@fastify/rate-limit` to prevent basic DDoS and spamming.
- The `database` schema enforces Row-Level Security (RLS) so frontend clients can only ever read, not write or mutate.

Thank you for helping keep the open source community secure!
