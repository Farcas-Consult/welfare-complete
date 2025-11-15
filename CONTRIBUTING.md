# Contributing to Welfare Management System

Thank you for your interest in contributing to the Welfare Management System! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/welfare-complete/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide as much detail as possible:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Clearly describe the feature and its benefits

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/welfare-complete.git
   cd welfare-complete
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the coding standards
   - Write or update tests
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Backend
   cd backend
   npm run lint
   npm test
   
   # Frontend
   cd frontend
   npm run lint
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use the PR template
   - Link to related issues
   - Describe your changes clearly

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Docker and Docker Compose (recommended)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/welfare-complete.git
   cd welfare-complete
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start services**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or manually
   # Start PostgreSQL, Redis, etc.
   ```

5. **Run migrations**
   ```bash
   cd backend
   npm run migration:run
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Backend (NestJS)

- Follow NestJS conventions
- Use dependency injection
- Implement proper error handling
- Add validation using DTOs
- Write unit tests for services
- Document API endpoints

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for props and state
- Keep components small and reusable
- Use Redux for global state management

### Git Workflow

- Create feature branches from `develop`
- Use descriptive commit messages
- Keep commits focused and atomic
- Rebase before creating PR
- Write clear PR descriptions

## Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm test -- --watch   # Watch mode
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation (Swagger)
- Keep CHANGELOG.md updated

## Questions?

- Open a [Discussion](https://github.com/yourusername/welfare-complete/discussions)
- Check existing [Issues](https://github.com/yourusername/welfare-complete/issues)
- Review the [Documentation](README.md)

Thank you for contributing! 🎉

