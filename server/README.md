
# Issue Reporting System - Backend Server

A complete Node.js/Express backend server for the Issue Reporting System with PostgreSQL database using Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for Community Members, Local Authorities, and System Administrators
- **Issue Management**: CRUD operations for issues with multimedia support
- **Category Management**: Admin-managed issue categories
- **Feedback System**: User feedback and rating system
- **File Upload**: Multimedia file support for issues
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: PostgreSQL with Sequelize ORM

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── config.json
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Location.js
│   │   ├── CommunityMember.js
│   │   ├── LocalAuthority.js
│   │   ├── SystemAdministrator.js
│   │   ├── Issue.js
│   │   ├── Multimedia.js
│   │   ├── Feedback.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── issueController.js
│   │   ├── categoryController.js
│   │   └── feedbackController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── issues.js
│   │   ├── categories.js
│   │   ├── feedback.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── errorHandler.js
│   └── app.js
├── seeders/
│   └── 20241212-categories.js
├── package.json
├── .env.example
├── .sequelizerc
└── README.md
```

## Installation & Setup

1. **Clone and navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   ```

4. **Database setup**:
   ```bash
   # Create database
   createdb issue_reporting_db
   
   # Run seeders (for categories)
   npm run seed
   ```

5. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)

### Issues
- `GET /api/issues` - Get all issues (with filtering and pagination)
- `POST /api/issues` - Create new issue
- `GET /api/issues/my-issues` - Get current user's issues
- `GET /api/issues/:id` - Get specific issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/issue/:issueId` - Get feedback for issue
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Utility
- `GET /api/health` - Health check

## User Roles

1. **CommunityMember**: Can create and manage their own issues, provide feedback
2. **LocalAuthority**: Can view and update assigned issues, provide feedback
3. **SystemAdministrator**: Full access to all features, manage categories

## Database Schema

The server uses the same database schema as defined in your Supabase setup:
- `users` - User accounts and basic info
- `community_members` - Community member profiles
- `local_authorities` - Local authority profiles
- `system_administrators` - Admin profiles
- `categories` - Issue categories
- `locations` - Geographic locations
- `issues` - Reported issues
- `multimedia` - File attachments for issues
- `feedback` - User feedback on issues

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=issue_reporting_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_DIALECT=postgres

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Security Features

- JWT authentication with bcrypt password hashing
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection with configurable origins
- Helmet for security headers
- Input validation and sanitization
- SQL injection protection via Sequelize ORM
- Role-based access control

## Error Handling

Comprehensive error handling for:
- Validation errors
- Authentication/authorization errors
- Database constraint violations
- File upload errors
- General server errors

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run database migrations
npm run migrate

# Run seeders
npm run seed

# Undo migrations
npm run migrate:undo

# Undo seeders
npm run seed:undo
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production-ready PostgreSQL database
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use environment variables for sensitive data
6. Set up SSL/TLS termination
7. Use a process manager like PM2

## Testing

The server includes comprehensive validation and error handling. You can test the API using tools like:
- Postman
- curl
- Your frontend application
- API testing frameworks

## License

MIT License
