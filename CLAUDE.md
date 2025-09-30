# Claude Desktop Project Instructions - Madrasti 2.0

## Project Overview
Madrasti 2.0 is a modern school management and e-learning platform for Moroccan schools with Django backend, React frontend, and multilingual support (Arabic, French, English).

## Architecture
- **Backend**: Django REST API with JWT authentication
- **Frontend**: React with Vite, TailwindCSS, shadcn/ui components
- **Database**: SQLite (development)
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary integration

## Key Modules
- **Users**: Authentication, profiles, roles (admin, teacher, student)
- **Schools**: Grades, classes, subjects, teachers management
- **Lessons**: Content management, tracks, educational levels
- **Homework**: Assignments, exercises, questions with multimedia
- **Attendance**: Student attendance tracking

## Development Commands

### Backend (Django)
```bash
cd backend
python manage.py runserver          # Start development server
python manage.py migrate           # Run database migrations
python manage.py createsuperuser   # Create admin user
python manage.py collectstatic     # Collect static files
python manage.py test             # Run tests
```

### Frontend (React)
```bash
cd frontend
npm install                       # Install dependencies
npm run dev                      # Start development server
npm run build                    # Build for production
npm run lint                     # Run ESLint
npm run preview                  # Preview production build
```

## Code Style Guidelines
- **Backend**: Follow Django/PEP 8 conventions
- **Frontend**: Use ESLint configuration, prefer functional components with hooks
- **Components**: Use shadcn/ui components, TailwindCSS for styling
- **Naming**: Use descriptive names, follow React/Django conventions
- **Imports**: Organize imports (React, libraries, local components)

## Key Patterns

### Backend Models
- Extend `AbstractUser` for custom user model
- Use `related_name` for foreign keys
- Implement `__str__` methods for admin interface
- Add proper `Meta` classes with ordering and verbose names

### Frontend Components
- Use `AuthContext` for authentication state
- Use `LanguageContext` for i18n
- Implement loading states and error handling
- Use React Router for navigation
- Follow shadcn/ui component patterns

### API Integration
- Use axios for HTTP requests
- Implement proper error handling
- Use React Query patterns for data fetching
- Handle JWT token refresh automatically

## File Structure
```
backend/
├── users/          # User management
├── schools/        # School entities (grades, classes, subjects)
├── lessons/        # Educational content
├── homework/       # Assignments and exercises
├── attendance/     # Attendance tracking
└── madrasti/       # Main Django app

frontend/
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Page components
│   ├── contexts/   # React contexts
│   ├── services/   # API service functions
│   ├── locales/    # Translation files
│   └── styles/     # Global styles
```

## Common Tasks

### Adding New Features
1. Create Django models with proper relationships
2. Add serializers for API responses
3. Implement views with proper permissions
4. Add URL patterns
5. Create React components with proper state management
6. Add API service functions
7. Implement routing and navigation

### Database Changes
1. Create Django migrations: `python manage.py makemigrations`
2. Apply migrations: `python manage.py migrate`
3. Update serializers if needed
4. Test API endpoints

### UI Components
- Use existing shadcn/ui components
- Follow TailwindCSS utility classes
- Implement responsive design
- Add proper accessibility attributes
- Use consistent spacing and colors

## Testing
- Write Django tests for models, views, and serializers
- Test API endpoints with proper authentication
- Test React components with user interactions
- Verify multilingual support

## Deployment Notes
- Set `DEBUG = False` for production
- Configure proper `ALLOWED_HOSTS`
- Set up environment variables for secrets
- Configure Cloudinary for file uploads
- Set up proper CORS settings

## Troubleshooting
- Check Django logs for backend issues
- Use browser dev tools for frontend debugging
- Verify JWT token validity for auth issues
- Check CORS settings for cross-origin requests
- Ensure proper migration state for database issues