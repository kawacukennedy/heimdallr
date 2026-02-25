# Contributing to Heimdallr

First off, thank you for considering contributing to Heimdallr! It's people like you that make Heimdallr such a powerful and beautiful open-source tool. 

Whether you're fixing a bug, adding a new customized WebGL shader, or creating a new real-time data integration, your contributions are incredibly valuable.

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and collaborative in all your interactions.

## How Can I Contribute?

### 🐛 Reporting Bugs
This section guides you through submitting a bug report for Heimdallr. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Check open issues**: Before creating a bug report, please check if the issue has already been reported.
- **Provide context**: Include OS, browser version, Heimdallr version, and a detailed description of what you were doing when the bug occurred.
- **Reproducible Steps**: Provide a clear list of steps to reproduce the issue. 

### ✨ Suggesting Enhancements
Enhancement suggestions are highly encouraged! 

- **Use cases**: Clearly describe the feature and its intended use cases.
- **Mockups/Specs**: If it's a visual or UI change, provide mockups. If it's a technical change (e.g., adding a new backend polling cron job), provide basic architectural thoughts.

### 💻 Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. **Setup your environment** by following the instructions in the `README.md`.
3. If you've added code that should be tested, **add tests**.
4. Ensure your code lints properly (`npm run lint` in both `frontend` and `backend`).
5. **Describe your changes** in detail in the Pull Request description.

---

## Development Architecture Guide

Before contributing, please read the architecture guides to understand the design philosophies and tech stacks:
- **[Frontend Architecture](../frontend/README.md)**: Details on CesiumJS, iOS 26 UI tokens, Custom Shaders, and Web Workers.
- **[Backend Architecture](../backend/README.md)**: Details on the Fastify proxies, node-cron polling, and Supabase integrations.

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps us auto-generate changelogs and version bumps.

Examples:
- `feat(frontend): add new volumetric cloud shader`
- `fix(backend): resolve memory leak in SGP4 cron job`
- `docs: update deployment guidelines for Render`

## Getting Help
If you need help, feel free to open a Discussion on GitHub or reach out to the core maintainers.

Happy coding! 🚀
