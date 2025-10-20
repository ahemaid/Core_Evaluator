# ServicePro Development Guide

This guide covers development practices, coding standards, and contribution guidelines for the ServicePro platform.

## Development Environment Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/servicepro.git
cd servicepro

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

## Project Structure

```
servicepro/
├── docs/                    # Documentation
├── src/                     # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── context/           # React contexts
├── backend/               # Backend source code
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── scripts/         # Utility scripts
├── e2e/                  # End-to-end tests
└── dist/                 # Build output
```

## Coding Standards

### JavaScript/TypeScript

#### Naming Conventions
- **Variables**: camelCase (`userName`, `isActive`)
- **Functions**: camelCase (`getUserData`, `validateInput`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Components**: PascalCase (`UserProfile`, `AdminDashboard`)
- **Files**: kebab-case (`user-profile.tsx`, `admin-dashboard.tsx`)

#### Code Style
```typescript
// Good
const getUserProfile = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

// Bad
const getUserProfile=async(userId:string)=>{
try{
const response=await api.get('/users/'+userId)
return response.data
}catch(error){
console.error(error)
throw error
}
}
```

#### TypeScript Guidelines
- Always use explicit types for function parameters and return values
- Use interfaces for object shapes
- Prefer `const` over `let`, avoid `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### React Components

#### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

const ExampleComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Side effects here
  }, []);

  const handleClick = () => {
    setIsLoading(true);
    onAction();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button 
        onClick={handleClick}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? t('common.loading') : t('common.submit')}
      </button>
    </div>
  );
};

export default ExampleComponent;
```

#### Hooks Usage
- Use custom hooks for reusable logic
- Keep hooks at the top level of components
- Use `useCallback` and `useMemo` for performance optimization when needed

### Backend (Node.js/Express)

#### Route Structure
```javascript
// routes/example.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const ExampleModel = require('../models/Example');

const router = express.Router();

// GET /api/examples
router.get('/', protect, async (req, res) => {
  try {
    const examples = await ExampleModel.find();
    res.json({
      success: true,
      data: examples
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch examples'
    });
  }
});

// POST /api/examples
router.post('/', [
  protect,
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const example = await ExampleModel.create(req.body);
    res.status(201).json({
      success: true,
      data: example
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create example'
    });
  }
});

module.exports = router;
```

#### Error Handling
```javascript
// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

### Database (MongoDB/Mongoose)

#### Model Definition
```javascript
// models/Example.js
const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'provider', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
ExampleSchema.index({ email: 1 });
ExampleSchema.index({ role: 1 });

module.exports = mongoose.model('Example', ExampleSchema);
```

## Testing Guidelines

### Frontend Testing

#### Component Testing
```typescript
// test/components/ExampleComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../../utils/translations';
import ExampleComponent from '../../components/ExampleComponent';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LanguageProvider initialLanguage="en">
      {component}
    </LanguageProvider>
  );
};

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    renderWithProvider(
      <ExampleComponent title="Test Title" onAction={jest.fn()} />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockAction = jest.fn();
    renderWithProvider(
      <ExampleComponent title="Test Title" onAction={mockAction} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

#### API Testing
```typescript
// test/services/api.test.ts
import { api } from '../services/api';

describe('API Service', () => {
  it('fetches user data', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser
    });

    const user = await api.getUser('1');
    expect(user).toEqual(mockUser);
  });
});
```

### Backend Testing

#### Unit Tests
```javascript
// tests/models/User.test.js
const User = require('../../models/User');

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it('should not create user with invalid email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });
});
```

#### Integration Tests
```javascript
// tests/api/auth.test.js
const request = require('supertest');
const app = require('../../server');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
  });
});
```

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/refactor-description` - Code refactoring
- `docs/documentation-update` - Documentation updates

### Commit Messages
```
type(scope): description

feat(auth): add JWT token refresh functionality
fix(api): resolve user registration validation error
docs(readme): update installation instructions
refactor(components): extract common button component
test(auth): add unit tests for login functionality
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes following coding standards
3. Add tests for new functionality
4. Update documentation if needed
5. Create pull request with detailed description
6. Request code review
7. Address feedback and merge

## Performance Guidelines

### Frontend Optimization
- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize images and assets
- Use proper caching strategies

### Backend Optimization
- Implement database indexing
- Use connection pooling
- Add response caching where appropriate
- Monitor and optimize slow queries

### Database Optimization
- Create appropriate indexes
- Use aggregation pipelines efficiently
- Implement proper data validation
- Monitor query performance

## Security Best Practices

### Frontend Security
- Sanitize user inputs
- Use HTTPS in production
- Implement proper authentication state management
- Validate data on client side

### Backend Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Use proper error handling
- Keep dependencies updated

## Debugging Tips

### Frontend Debugging
```typescript
// Use React DevTools
// Add console.log strategically
console.log('Component rendered with props:', props);

// Use browser dev tools
// Check network tab for API calls
// Use React DevTools profiler
```

### Backend Debugging
```javascript
// Use proper logging
const logger = require('winston');

logger.info('User login attempt', { userId, email });
logger.error('Database connection failed', { error: err.message });

// Use debug mode
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}
```

## Code Review Checklist

### Frontend Review
- [ ] Component follows naming conventions
- [ ] Props are properly typed
- [ ] Error handling is implemented
- [ ] Accessibility considerations
- [ ] Performance optimizations
- [ ] Tests are included
- [ ] Translations are used

### Backend Review
- [ ] Input validation is implemented
- [ ] Error handling is proper
- [ ] Security considerations
- [ ] Database queries are optimized
- [ ] Tests are included
- [ ] Documentation is updated

## Common Patterns

### API Response Pattern
```javascript
// Success response
res.json({
  success: true,
  data: result,
  message: 'Operation successful'
});

// Error response
res.status(400).json({
  success: false,
  error: 'Error message',
  details: errorDetails
});
```

### Component Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [VS Code Extensions](https://code.visualstudio.com/docs)
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

---

**Development Guide Version**: 1.0.0  
**Last Updated**: December 2024
