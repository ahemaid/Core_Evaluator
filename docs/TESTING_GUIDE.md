# ServicePro Testing Guide

This guide covers the comprehensive testing suite for the ServicePro platform, including unit tests, integration tests, API tests, and end-to-end tests.

## 🧪 Testing Overview

### Test Types
- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test API endpoints and database interactions
- **Component Tests**: Test React components with user interactions
- **E2E Tests**: Test complete user workflows across the application

### Test Frameworks
- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Run All Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# E2E tests
npm run e2e

# All tests
npm run test:all
```

### Run Specific Test Suites
```bash
# Backend unit tests
cd backend && npm run test:models

# Backend API tests
cd backend && npm run test:api

# Frontend component tests
npm run test:components

# Frontend service tests
npm run test:services
```

## 📁 Test Structure

```
ServicePro Project/
├── backend/
│   ├── tests/
│   │   ├── setup.js                 # Test configuration
│   │   ├── models/                  # Model unit tests
│   │   │   └── User.test.js
│   │   └── api/                     # API integration tests
│   │       ├── auth.test.js
│   │       └── serviceProviders.test.js
│   ├── jest.config.js               # Jest configuration
│   └── package.json                 # Test scripts
├── src/
│   ├── test/
│   │   ├── setup.ts                 # Frontend test setup
│   │   ├── components/              # Component tests
│   │   │   └── HomePage.test.tsx
│   │   └── services/                # Service tests
│   │       └── api.test.ts
│   └── ...
├── e2e/                             # End-to-end tests
│   ├── homepage.spec.ts
│   └── auth.spec.ts
├── playwright.config.ts             # Playwright configuration
├── vite.config.ts                   # Vitest configuration
└── .github/workflows/test.yml       # CI/CD pipeline
```

## 🔧 Backend Testing

### Setup
Backend tests use Jest with MongoDB Memory Server for isolated testing.

```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server
```

### Configuration
- **Jest Config**: `jest.config.js`
- **Test Setup**: `tests/setup.js`
- **Database**: In-memory MongoDB for each test

### Running Backend Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test files
npm run test:models
npm run test:api
```

### Test Examples

#### Model Tests
```javascript
// tests/models/User.test.js
describe('User Model', () => {
  test('should create user with valid data', async () => {
    const user = await User.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    });
    
    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password123'); // Should be hashed
  });
});
```

#### API Tests
```javascript
// tests/api/auth.test.js
describe('Auth API', () => {
  test('should login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
```

## 🎨 Frontend Testing

### Setup
Frontend tests use Vitest with React Testing Library.

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Configuration
- **Vitest Config**: `vite.config.ts`
- **Test Setup**: `src/test/setup.ts`
- **Mocking**: Automatic mocking of browser APIs

### Running Frontend Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui

# Specific test suites
npm run test:components
npm run test:services
```

### Test Examples

#### Component Tests
```typescript
// src/test/components/HomePage.test.tsx
describe('HomePage', () => {
  test('renders main title', () => {
    render(<HomePage />);
    expect(screen.getByText(/home.title/)).toBeInTheDocument();
  });

  test('handles search form submission', async () => {
    const mockNavigate = vi.fn();
    render(<HomePage />);
    
    fireEvent.click(screen.getByRole('button', { name: /search/ }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });
});
```

#### Service Tests
```typescript
// src/test/services/api.test.ts
describe('API Service', () => {
  test('should login successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: 'mock-token',
        user: { id: '1', name: 'Test User' }
      })
    });

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-token');
  });
});
```

## 🌐 End-to-End Testing

### Setup
E2E tests use Playwright for cross-browser testing.

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration
- **Playwright Config**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Server**: Automatic dev server startup

### Running E2E Tests
```bash
# All tests
npm run e2e

# UI mode
npm run e2e:ui

# Headed mode (see browser)
npm run e2e:headed

# Debug mode
npm run e2e:debug
```

### Test Examples

#### Homepage Tests
```typescript
// e2e/homepage.spec.ts
test('displays main hero section', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('search form functionality', async ({ page }) => {
  await page.goto('/');
  
  await page.selectOption('select:first-of-type', 'Algeria');
  await page.selectOption('select:nth-of-type(2)', 'healthcare');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*search.*/);
});
```

#### Authentication Tests
```typescript
// e2e/auth.spec.ts
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## 🔄 Continuous Integration

### GitHub Actions
The CI pipeline runs on every push and pull request:

1. **Backend Tests**: Unit and integration tests with MongoDB
2. **Frontend Tests**: Component and service tests
3. **E2E Tests**: Cross-browser end-to-end tests
4. **Linting**: Code quality checks
5. **Security Audit**: Dependency vulnerability scanning

### Pipeline Configuration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm run test:coverage
```

## 📊 Test Coverage

### Coverage Reports
- **Backend**: HTML report in `backend/coverage/`
- **Frontend**: HTML report in `coverage/`
- **E2E**: Playwright HTML report

### Coverage Goals
- **Unit Tests**: >90% coverage
- **Integration Tests**: >80% coverage
- **E2E Tests**: Critical user flows

### Viewing Coverage
```bash
# Backend coverage
cd backend && npm run test:coverage
open coverage/lcov-report/index.html

# Frontend coverage
npm run test:coverage
open coverage/index.html

# E2E report
npm run e2e
open playwright-report/index.html
```

## 🐛 Debugging Tests

### Backend Debugging
```bash
# Run specific test with debugging
cd backend && npx jest --testNamePattern="should login" --verbose

# Debug with Node inspector
cd backend && node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Debugging
```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test HomePage.test.tsx

# Debug with VS Code
# Use "Debug Jest Tests" configuration
```

### E2E Debugging
```bash
# Run in headed mode to see browser
npm run e2e:headed

# Debug mode with step-through
npm run e2e:debug

# Run specific test
npx playwright test homepage.spec.ts
```

## 📝 Writing Tests

### Best Practices

#### Backend Tests
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Clean up after each test
- Use factories for test data

#### Frontend Tests
- Test user interactions, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Mock API calls and external services
- Test accessibility features
- Use data-testid sparingly

#### E2E Tests
- Test complete user workflows
- Use page object model for complex pages
- Test across different browsers and devices
- Keep tests independent and isolated
- Use meaningful assertions

### Test Data Management
```javascript
// Backend test factories
const createUser = (overrides = {}) => ({
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
  ...overrides
});

// Frontend test utilities
const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(component, { wrapper: BrowserRouter });
};
```

## 🚀 Test Automation

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "npm test -- --findRelatedTests"
    ]
  }
}
```

### Test Scripts Summary
```bash
# Backend
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:models        # Model tests only
npm run test:api          # API tests only

# Frontend
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:ui           # UI mode
npm run test:components   # Component tests
npm run test:services     # Service tests

# E2E
npm run e2e               # Run all E2E tests
npm run e2e:ui            # UI mode
npm run e2e:headed        # Headed mode
npm run e2e:debug         # Debug mode

# All
npm run test:all          # Run all test suites
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Vitest Documentation](https://vitest.dev/guide/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎯 Test Checklist

### Before Committing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All component tests pass
- [ ] All E2E tests pass
- [ ] Code coverage meets thresholds
- [ ] No linting errors
- [ ] Security audit passes

### Before Deployment
- [ ] CI pipeline passes
- [ ] All browsers tested (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness tested
- [ ] Performance tests pass
- [ ] Accessibility tests pass

This comprehensive testing suite ensures the ServicePro platform is reliable, maintainable, and user-friendly! 🚀
