# ServicePro - Healthcare Platform

A comprehensive healthcare platform that connects patients with healthcare providers, featuring multi-language support, role-based access control, and advanced analytics.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/servicepro.git
cd servicepro

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start development servers
npm run dev          # Frontend (http://localhost:5173)
cd backend && npm start  # Backend (http://localhost:5000)
```

## 📚 Documentation

All documentation is available in the [`docs/`](./docs/) directory:

- **[📖 Complete Documentation](./docs/README.md)** - Main documentation index
- **[🚀 Setup Guide](./docs/SETUP_GUIDE.md)** - Development environment setup
- **[🌐 API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[🚀 Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Production deployment
- **[💻 Development Guide](./docs/DEVELOPMENT_GUIDE.md)** - Coding standards and practices
- **[🧪 Testing Guide](./docs/TESTING_GUIDE.md)** - Testing strategies
- **[🗄️ MongoDB Setup](./docs/MONGODB_SETUP_GUIDE.md)** - Database configuration

## ✨ Features

### 🌍 Multi-language Support
- Arabic (العربية) - Default
- English
- German (Deutsch)

### 👥 User Roles
- **Admin**: Platform management and oversight
- **Provider**: Healthcare service providers
- **User**: Patients and service seekers

### 🏥 Core Features
- **Service Provider Management**: Complete provider profiles and verification
- **Appointment Booking**: Easy scheduling and management
- **Review System**: Transparent feedback and ratings
- **Quality Metrics**: Service Quality Index (SQI) calculation
- **Real-time Communication**: In-app messaging and notifications
- **Analytics Dashboard**: Comprehensive reporting and insights

### 🔧 Technical Features
- **Role-Based Access Control (RBAC)**: Granular permission system
- **JWT Authentication**: Secure user authentication
- **File Upload Support**: Profile photos and document uploads
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Recharts** for analytics

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for input validation

### Testing
- **Jest** for unit testing
- **Playwright** for E2E testing
- **React Testing Library** for component testing

## 📁 Project Structure

```
servicepro/
├── docs/                    # 📚 Documentation
├── src/                     # 🎨 Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utilities
│   └── types/             # TypeScript types
├── backend/               # ⚙️ Backend source
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── scripts/          # Utility scripts
├── e2e/                  # 🧪 End-to-end tests
└── dist/                 # 📦 Build output
```

## 🌐 API Endpoints

- **Authentication**: `/api/auth`
- **Service Providers**: `/api/service-providers`
- **Appointments**: `/api/appointments`
- **Reviews**: `/api/reviews`
- **Admin**: `/api/admin`
- **Messages**: `/api/messages`
- **Notifications**: `/api/notifications`
- **Quality Metrics**: `/api/quality`
- **RBAC**: `/api/rbac`
- **Provider Portal**: `/api/provider-portal`

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

See the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) for detailed production deployment instructions.

## 🤝 Contributing

1. Read the [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
2. Follow the setup instructions
3. Create a feature branch
4. Make your changes
5. Add tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 Check the [documentation](./docs/)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

**ServicePro** - Connecting healthcare providers with patients worldwide 🌍

*Last updated: December 2024*
