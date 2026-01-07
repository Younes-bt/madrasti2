# Madrasti 2.0 - Project Documentation

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![Django](https://img.shields.io/badge/django-5.2.5-green)
![React](https://img.shields.io/badge/react-19.1.1-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

## Overview

**Madrasti 2.0** is a comprehensive school management and e-learning platform specifically designed for Moroccan schools. The platform provides complete solutions for academic management, student assessment, attendance tracking, virtual laboratories, and gamified learning experiences.

### Key Highlights

- 🏫 **Complete School Management**: Handle all aspects from enrollment to graduation
- 📚 **Modern Content Management**: Notion-style block editor for rich lesson content
- ✅ **Advanced Assessment**: 8 question types with auto-grading capabilities
- 🎮 **Gamification System**: 5 reward currencies, badges, and leaderboards
- 👥 **Attendance Management**: Smart tracking with parent notifications
- 🔬 **Virtual Laboratory**: Interactive subject-specific tools
- 🌍 **Multilingual**: Full support for Arabic, French, and English
- 🇲🇦 **Moroccan Education**: Built for the Moroccan academic system

## Documentation Structure

This documentation is organized into multiple files for easy navigation:

1. **[README.md](./README.md)** (this file) - Project overview and quick start
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and technologies
3. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Complete database schema with all models
4. **[FEATURES.md](./FEATURES.md)** - Detailed features and workflows
5. **[API_REFERENCE.md](./API_REFERENCE.md)** - API endpoints and usage
6. **[FRONTEND.md](./FRONTEND.md)** - Frontend architecture and components

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional, SQLite for development)
- Cloudinary account (for media storage)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with API URL

# Run development server
npm run dev
```

### Access the Application

- **Backend API**: http://localhost:8000/api/
- **Frontend**: http://localhost:5173/
- **Admin Panel**: http://localhost:8000/admin/

## Project Structure

```
madrasti2/
├── backend/                 # Django REST API
│   ├── users/              # User management
│   ├── schools/            # School structure
│   ├── lessons/            # Lesson content
│   ├── homework/           # Assignments & gamification
│   ├── attendance/         # Attendance tracking
│   ├── lab/                # Virtual laboratory
│   ├── activity_log/       # System audit logs
│   ├── communication/      # Messaging (in progress)
│   ├── finance/            # Finance management (in progress)
│   └── reports/            # Analytics (in progress)
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── locales/       # Translations
│   └── public/            # Static assets
└── docs/                  # Documentation (this folder)
```

## Core Features

### For Students
- 📖 Access lessons with rich multimedia content
- 📝 Submit homework and exercises
- 🏆 Earn rewards, badges, and track progress
- 📊 View grades and performance analytics
- 📅 Check attendance records
- 🔬 Use virtual lab tools
- 🏅 Compete in leaderboards

### For Teachers
- ✏️ Create and publish lessons with block-based editor
- 📋 Assign homework with multiple question types
- ✅ Auto-grade QCM questions
- 📊 Track student progress and analytics
- 👥 Mark attendance with bulk operations
- 🔬 Assign virtual lab tasks
- 💬 Communicate with students and parents

### For Parents
- 👀 Monitor children's academic progress
- 📧 Receive attendance notifications
- 📈 View grades and performance reports
- 💬 Communicate with teachers
- 💰 Access financial information

### For Administrators
- 🏫 Configure school structure and settings
- 👥 Manage users and enrollments
- 📊 Access comprehensive analytics
- 🚗 Manage vehicles and infrastructure
- 💰 Handle financial operations
- 📋 Generate reports

## Technology Stack

### Backend
- **Django 5.2.5** - Web framework
- **Django REST Framework 3.16.1** - API
- **SimpleJWT 5.5.1** - Authentication
- **Cloudinary 1.44.1** - Media storage
- **PostgreSQL** - Database (production)
- **Google Gemini AI** - Exercise generation

### Frontend
- **React 19.1.1** - UI framework
- **Vite 7.1.2** - Build tool
- **TailwindCSS 3.4.17** - Styling
- **shadcn/ui** - Component library
- **TanStack Query 5.85.6** - Server state
- **React Router 7.8.2** - Routing
- **Three.js** - 3D graphics
- **i18next** - Internationalization

## Development Team

- **Project Lead**: OpiComTech
- **Version**: 2.0 (in development)
- **Last Updated**: December 2025

## License

This is proprietary software developed for educational institutions. All rights reserved.

## Support & Feedback

For issues and feature requests, please contact the development team or create an issue in the project repository.

---

**Note**: This project is actively under development. Some features may be incomplete or subject to change.
