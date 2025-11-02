# GitHub Copilot Instructions for DCK Tools

## Project Purpose

DCK Tools is a modern React application that integrates BullX metadata and trading terminal functionality with built-in safety features for on-chain operations. The application provides developers with tools to interact with blockchain data while enforcing safe defaults (devnet-first approach).

## Technologies & Stack

### Core Technologies
- **React 18.2**: Modern React with hooks and functional components
- **TypeScript 5.3**: Strict mode enabled with comprehensive type checking
- **Vite 5.0**: Fast development server and build tool
- **Vitest 1.0**: Modern testing framework for unit and component tests

### Key Libraries
- **React Testing Library**: Component testing with user-centric approach
- **jsdom**: Browser environment simulation for tests

### Build & Development Tools
- **ESLint**: Code linting with TypeScript and React plugins
- **TypeScript Compiler**: Type checking with strict settings
- **npm**: Package management

## Project Structure

```
src/
├── lib/           # Core utilities and API clients
├── hooks/         # React hooks (e.g., useBullXMetadata)
├── components/    # React components (BullXEmbed, DangerZone)
├── test/          # Test setup and utilities
└── App.tsx        # Main application component
```

## Development Commands

### Setup
```bash
npm install          # Install dependencies
npm run dev          # Start development server (Vite)
```

### Quality & Testing
```bash
npm run lint         # Run ESLint checks
npm run type-check   # Run TypeScript type checking
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI interface
npm run test:coverage # Run tests with coverage report
```

### Build
```bash
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build
```

## Code Style & Standards

### TypeScript
- **Strict mode enabled**: All strict TypeScript checks are active
- Use explicit types for function parameters and return values
- Leverage TypeScript's type inference where appropriate
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes and types for unions/primitives

### React
- **Functional components only**: Use hooks instead of class components
- Follow React hooks rules (dependencies, conditional calls, etc.)
- Use proper dependency arrays in `useEffect`, `useMemo`, `useCallback`
- Implement proper error boundaries where needed
- Keep components focused and single-responsibility

### Code Organization
- Export components as default from their files
- Co-locate tests with implementation files (`.test.ts` or `.test.tsx`)
- Use descriptive variable and function names
- Keep functions small and focused
- Prefer composition over inheritance

### Testing
- Write tests using Vitest and React Testing Library
- Test user interactions, not implementation details
- Mock external dependencies (APIs, environment variables)
- Aim for meaningful test coverage, not just high percentages
- Test error states and edge cases

## Key Features to Understand

### 1. BullX Integration
- **BullX Metadata Client** (`src/lib/bullx-client.ts`): Fetches token metadata from BullX API
- **TTL Cache** (`src/lib/ttl-cache.ts`): In-memory cache with time-to-live for API responses
- **useBullXMetadata Hook**: React hook for fetching and caching metadata
- **BullXEmbed Component**: Iframe-based embedding of BullX trading terminal

### 2. Safety Features
- **DangerZone Component**: Gated access to on-chain actions
  - Defaults to devnet for safety
  - Requires explicit user confirmation
  - Auto-locks on network changes
  - Visual indicators for locked/unlocked states

### 3. Environment Variables
- `VITE_BULLX_API_URL`: Optional BullX API endpoint (defaults to https://api.bullx.io/v1)
- `VITE_BULLX_EMBED_URL`: Optional BullX embed URL (defaults to https://bullx.io)
- All environment variables must be prefixed with `VITE_` for Vite to expose them

## Security Considerations

### When Working on Code
- **Never commit secrets or API keys**: Use environment variables
- **Validate user inputs**: Especially for on-chain operations
- **Use iframe sandboxing**: Maintain sandbox attributes for embeds
- **Default to safe options**: Devnet should always be the default network
- **Require explicit confirmations**: For dangerous operations

### BullX Embed Security
- Use `sandbox` attribute with appropriate permissions
- Restrict iframe capabilities to minimum required
- Provide fallback UI when iframe fails to load

## Best Practices for Changes

### Before Making Changes
1. Run `npm run type-check` to ensure no TypeScript errors
2. Run `npm run lint` to check code style
3. Run `npm test -- --run` to ensure tests pass
4. Understand the existing patterns in similar files

### When Adding Features
1. Write tests first or alongside implementation
2. Follow existing patterns in the codebase
3. Update TypeScript types appropriately
4. Consider error handling and edge cases
5. Ensure changes don't break existing functionality

### When Fixing Bugs
1. Add a test that reproduces the bug (if applicable)
2. Make minimal changes to fix the issue
3. Verify the fix doesn't introduce new issues
4. Run full test suite to ensure no regressions

### When Refactoring
1. Ensure tests pass before and after changes
2. Make incremental, reviewable changes
3. Maintain backward compatibility where possible
4. Update documentation if behavior changes

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:
- **Multi-version testing**: Tests run on Node.js 18.x and 20.x
- **Automated checks**: Linting, type checking, testing, and building
- **Code coverage**: Optional coverage reporting to Codecov
- All checks must pass before merging

## Common Pitfalls to Avoid

1. **Not using `VITE_` prefix**: Vite requires this prefix for environment variables
2. **Incorrect dependency arrays**: Can cause infinite loops or stale closures
3. **Missing error handling**: Always handle API failures and edge cases
4. **Breaking type safety**: Avoid using `any` or type assertions without good reason
5. **Ignoring existing patterns**: Follow established patterns in the codebase
6. **Not testing async behavior**: Properly test async operations and loading states
7. **Forgetting to mock dependencies**: Tests should be isolated from external services

## Getting Help

- Check existing tests for usage examples
- Review similar components or hooks for patterns
- Consult the README.md for architectural decisions
- TypeScript errors are your friend - they prevent runtime issues
- Use the development server for rapid iteration and testing

## Summary

When working on this project:
- **Prioritize safety**: Default to safe options, require confirmations
- **Maintain type safety**: Leverage TypeScript's strict checking
- **Write tests**: Ensure changes are well-tested
- **Follow patterns**: Consistency matters for maintainability
- **Keep it simple**: Prefer clear, readable code over clever solutions
