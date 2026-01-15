# CoreBank - Mini Core Banking System Frontend

A modern, professional ReactJS frontend for a Mini Core Banking System with JWT authentication, account management, and fund transfer capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running at `https://amused-kiri-quanggiap-0ccda032.koyeb.app/`

Access the application at: **https://corebanking-fe.vercel.app/**

### Demo Credentials

```
Username: giapdeptrai2
Password: stbgiap
```

## ✨ Features

- ✅ **User Authentication** - Register, login, logout with JWT
- ✅ **Dashboard** - View all accounts with balances
- ✅ **Account Details** - Complete account info and audit trail
- ✅ **Fund Transfers** - Secure transfers with validation
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Premium UI** - Beautiful gradients and smooth animations

## 🎨 Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **TailwindCSS v4** - Utility-first CSS framework
- **React Hook Form + Yup** - Form validation
- **Headless UI** - Accessible UI components
- **React Hot Toast** - Beautiful notifications

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (Login, Dashboard, etc.)
├── contexts/        # React contexts (AuthContext)
├── services/        # API services
├── utils/           # Utilities (formatters, validators)
├── hooks/           # Custom hooks
└── App.jsx          # Main app with routing
```

## 🏗️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Pages

- `/login` - User login
- `/register` - User registration (multi-step)
- `/dashboard` - Accounts overview
- `/accounts/:id` - Account details and audit trail
- `/transfer` - Fund transfer form

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

**Build Command:** `npm run build`  
**Publish Directory:** `dist`

## 📝 Environment Variables

```env
VITE_API_BASE_URL=https://amused-kiri-quanggiap-0ccda032.koyeb.app/api
```

## 🤝 Backend Integration

This frontend expects the following backend API endpoints:

**Auth:**
- `POST /api/auth/login`
- `POST /api/auth/register`

**Accounts:**
- `GET /api/accounts/{id}`
- `GET /api/accounts/user/{userId}`
- `GET /api/accounts/{id}/audit`

**Transfers:**
- `POST /api/transfers`

**Built with ❤️ using React + Vite + TailwindCSS**
