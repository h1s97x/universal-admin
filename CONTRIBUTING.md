# Contributing to universal-admin

Thank you for your interest in contributing!

## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build all packages: `pnpm build`
4. Run tests: `pnpm test`

## Branch Strategy

- `main` - Stable release branch
- `fix/*` - Bug fix branches
- `feat/*` - Feature branches

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `fix:` - Bug fixes
- `feat:` - New features
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or auxiliary tool changes

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

## Packages

This is a monorepo containing:

- `@cogitant/rbac` - RBAC permission system
- `@cogitant/admin-shell` - Admin dashboard layout
- `@cogitant/api-client` - Type-safe API client
- `@cogitant/notify` - Notification system
- `@cogitant/universal-ui` - Universal UI components
