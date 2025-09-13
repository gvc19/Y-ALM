# Authentication System Documentation

This NestJS application includes a complete authentication system with JWT tokens, user management, and database migrations.

## Features

- **User Registration & Login**: Secure user authentication with bcrypt password hashing
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Database Migrations**: TypeORM-based migration system for database schema management
- **Swagger Documentation**: API documentation with OpenAPI/Swagger
- **Environment Configuration**: Flexible configuration using environment variables

## API Endpoints

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Request/Response Examples

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected Route)
```bash
GET /auth/profile
Authorization: Bearer <jwt_token>
```

## Database Setup

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE nestjs_auth;
```

### 2. Environment Configuration
Copy `env.example` to `.env` and update the values:
```bash
cp env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=nestjs_auth
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Run Migrations
```bash
# Run pending migrations
npm run migration:run

# Check migration status
npm run migration:status

# Revert last migration (if needed)
npm run migration:revert
```

## Project Structure

```
src/
├── auth/
│   ├── controllers/     # Auth endpoints
│   ├── services/        # Business logic
│   ├── entities/        # Database models
│   ├── dto/            # Data transfer objects
│   ├── strategies/      # Passport strategies
│   └── guards/          # Authentication guards
├── config/              # Configuration files
├── database/            # Database setup & migrations
│   ├── migrations/      # Database migration files
│   └── services/        # Migration runner service
└── cli/                 # Command line tools
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Class-validator decorators
- **SQL Injection Protection**: TypeORM parameterized queries
- **CORS Protection**: Configurable cross-origin settings

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | password |
| `DB_NAME` | Database name | nestjs_auth |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `NODE_ENV` | Environment mode | development |
| `PORT` | Application port | 3000 |

## Migration Commands

```bash
# Run all pending migrations
npm run migration:run

# Check migration status
npm run migration:status

# Revert last migration
npm run migration:revert

# Custom migration command
npm run migration <command>
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Migration Errors**
   - Check database permissions
   - Verify migration files are valid
   - Check for conflicting migrations

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

### Logs
The application logs migration progress and authentication events. Check the console output for detailed information.

## Contributing

When adding new features:
1. Create appropriate DTOs with validation
2. Add Swagger documentation
3. Write unit tests
4. Update this documentation
5. Create database migrations if needed
