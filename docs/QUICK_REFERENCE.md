# ServicePro Quick Reference

This is a quick reference guide for common tasks and commands in the ServicePro project.

## 🚀 Quick Commands

### Development
```bash
# Start frontend development server
npm run dev

# Start backend development server
cd backend && npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database
```bash
# Initialize RBAC system
cd backend && node scripts/initializeRBAC.js

# Run database migrations
cd backend && node scripts/migrate.js
```

## 📁 Key Files

### Frontend
- `src/App.tsx` - Main application component
- `src/components/Layout/Header.tsx` - Navigation header
- `src/pages/dashboard/` - Dashboard components
- `src/utils/translations.tsx` - Translation system
- `src/services/api.ts` - API service layer

### Backend
- `backend/server.js` - Main server file
- `backend/models/` - Database models
- `backend/routes/` - API routes
- `backend/middleware/auth.js` - Authentication middleware
- `backend/middleware/rbac.js` - RBAC middleware

## 🌐 Common URLs

### Development
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

### API Endpoints
- Auth: `/api/auth`
- Users: `/api/users`
- Providers: `/api/service-providers`
- Appointments: `/api/appointments`
- Reviews: `/api/reviews`
- Admin: `/api/admin`

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ServicePro
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/servicepro
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## 🎨 Styling

### Tailwind CSS Classes
```css
/* Common utility classes */
.btn-primary    /* Primary button */
.btn-secondary  /* Secondary button */
.text-primary   /* Primary text color */
.bg-primary     /* Primary background */
.container      /* Responsive container */
.grid           /* CSS Grid */
.flex           /* Flexbox */
```

### Responsive Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

## 🌍 Translations

### Adding New Translations
1. Add key to `src/utils/translations.tsx`
2. Use `t('key')` in components
3. Support all languages (en, de, ar)

### Translation Keys
```typescript
// Common keys
t('common.save')
t('common.cancel')
t('common.loading')
t('common.error')

// Page-specific keys
t('home.title')
t('dashboard.overview')
t('auth.login')
```

## 🔐 Authentication

### User Roles
- `user` - Regular users/patients
- `provider` - Service providers
- `admin` - Platform administrators

### Protected Routes
```typescript
// Require authentication
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

// Require specific role
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
```

## 📊 Database Models

### Key Models
- `User` - User accounts
- `ServiceProvider` - Provider profiles
- `Appointment` - Booking records
- `Review` - User reviews
- `Role` - RBAC roles
- `Permission` - RBAC permissions

### Common Queries
```javascript
// Find user by email
const user = await User.findOne({ email });

// Find providers by category
const providers = await ServiceProvider.find({ category });

// Find appointments for user
const appointments = await Appointment.find({ user: userId });
```

## 🧪 Testing

### Frontend Tests
```bash
# Run component tests
npm test

# Run specific test file
npm test -- HomePage.test.tsx

# Run tests in watch mode
npm test -- --watch
```

### Backend Tests
```bash
# Run all tests
cd backend && npm test

# Run specific test file
cd backend && npm test -- auth.test.js
```

### E2E Tests
```bash
# Run Playwright tests
npm run test:e2e

# Run specific test
npx playwright test auth.spec.ts
```

## 🐛 Common Issues

### Frontend Issues
- **Build errors**: Check TypeScript types and imports
- **Styling issues**: Verify Tailwind classes and responsive breakpoints
- **Translation issues**: Check translation keys exist

### Backend Issues
- **Database connection**: Verify MongoDB URI and network access
- **Authentication errors**: Check JWT secret and token expiration
- **File upload issues**: Verify multer configuration and file limits

### Development Issues
- **Port conflicts**: Change ports in package.json or .env
- **Module not found**: Run `npm install` to install dependencies
- **Hot reload not working**: Restart development server

## 📝 Code Snippets

### React Component Template
```typescript
import React from 'react';
import { useTranslation } from '../utils/translations';

interface Props {
  title: string;
}

const Component: React.FC<Props> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
};

export default Component;
```

### API Route Template
```javascript
const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    // Route logic here
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Database Model Template
```javascript
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Add more fields
}, {
  timestamps: true
});

module.exports = mongoose.model('Model', Schema);
```

## 🔗 Useful Links

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/docs/intro)

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: December 2024
