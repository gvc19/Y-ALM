# SQL-Based CRUD Operations Documentation

This NestJS application now uses **raw SQL queries** for all database operations instead of TypeORM's query builder. This approach provides better performance, more control over queries, and easier optimization.

## 🎯 **Key Features**

- **Raw SQL Queries**: Direct database access with optimized queries
- **Parameterized Queries**: SQL injection protection using parameterized statements
- **Organized Query Management**: All SQL queries centralized in `sql-queries.ts`
- **Dynamic Query Building**: Flexible update queries that only modify specified fields
- **Advanced CRUD Operations**: Pagination, search, bulk operations, and more

## 🗂️ **Project Structure**

```
src/auth/
├── sql-queries.ts           # Centralized SQL queries
├── auth.service.ts          # Service with SQL-based CRUD methods
├── auth.controller.ts       # REST endpoints for CRUD operations
├── entities/                # TypeORM entities (for type definitions)
└── dto/                    # Data transfer objects
```

## 📊 **Available CRUD Operations**

### **Basic CRUD**
- `POST /auth/register` - Create new user
- `GET /auth/:id` - Read user by ID
- `PUT /auth/:id` - Update user
- `DELETE /auth/:id` - Delete user

### **Advanced Operations**
- `GET /auth` - Get all users
- `GET /auth/active` - Get active users only
- `GET /auth/search/email?pattern=john` - Search users by email
- `GET /auth/paginated?page=1&limit=10` - Paginated user list
- `PATCH /auth/:id/activate` - Activate user
- `PATCH /auth/:id/deactivate` - Deactivate user
- `PATCH /auth/bulk/status` - Bulk update user status

## 🔧 **SQL Query Organization**

### **Query File Structure** (`sql-queries.ts`)

```typescript
export const USER_QUERIES = {
  // Basic CRUD
  CHECK_USER_EXISTS: 'SELECT id FROM users WHERE email = $1',
  INSERT_USER: `INSERT INTO users (...) VALUES (...) RETURNING ...`,
  GET_USER_BY_ID: `SELECT ... FROM users WHERE id = $1`,
  
  // Advanced queries
  SEARCH_USERS_BY_EMAIL: `SELECT ... FROM users WHERE email ILIKE $1`,
  GET_USERS_PAGINATED: `SELECT ... FROM users ORDER BY ... LIMIT $1 OFFSET $2`,
  BULK_UPDATE_STATUS: `UPDATE users SET ... WHERE id IN (...)`
};
```

### **Dynamic Query Building**

```typescript
// Only update specified fields
const { updateFields, values } = buildUpdateQuery({
  firstName: 'John',
  email: 'john@example.com'
});

// Generates: UPDATE users SET firstName = $1, email = $2, updatedAt = NOW() WHERE id = $3
```

## 🚀 **Usage Examples**

### **1. User Registration (Create)**
```typescript
// SQL: INSERT INTO users (email, password, firstName, lastName, isActive, createdAt, updatedAt)
//      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
//      RETURNING id, email, firstName, lastName, isActive, createdAt, updatedAt

const user = await this.authService.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});
```

### **2. User Search (Read with Filter)**
```typescript
// SQL: SELECT ... FROM users WHERE email ILIKE $1 ORDER BY createdAt DESC

const users = await this.authService.searchUsersByEmail('john');
// Finds: john@example.com, johnny@test.com, etc.
```

### **3. Paginated User List (Read with Pagination)**
```typescript
// SQL: SELECT ... FROM users ORDER BY createdAt DESC LIMIT $1 OFFSET $2
//      SELECT COUNT(*) as total FROM users

const result = await this.authService.getUsersPaginated(1, 10);
// Returns: { users: [...], total: 100, page: 1, limit: 10, totalPages: 10 }
```

### **4. Dynamic User Update (Update)**
```typescript
// SQL: UPDATE users SET firstName = $1, updatedAt = NOW() WHERE id = $2
//      RETURNING id, email, firstName, lastName, isActive, createdAt, updatedAt

const updatedUser = await this.authService.update(userId, {
  firstName: 'Jane'
});
// Only updates firstName, leaves other fields unchanged
```

### **5. Bulk Operations (Update Multiple)**
```typescript
// SQL: UPDATE users SET isActive = $1, updatedAt = NOW() WHERE id IN ($2, $3, $4)
//      RETURNING id

const result = await this.authService.bulkUpdateStatus(
  ['user1', 'user2', 'user3'], 
  false
);
// Deactivates multiple users in a single query
```

## 🛡️ **Security Features**

### **SQL Injection Protection**
- **Parameterized Queries**: All user inputs use `$1`, `$2` placeholders
- **No String Concatenation**: Queries are built safely using parameter arrays
- **Type Safety**: TypeScript ensures proper parameter types

```typescript
// ✅ Safe - Parameterized
await this.dataSource.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);

// ❌ Dangerous - String concatenation (NOT USED)
// `SELECT * FROM users WHERE email = '${userEmail}'`
```

### **Input Validation**
- **DTO Validation**: Class-validator decorators ensure data integrity
- **Type Checking**: TypeScript compilation catches type mismatches
- **Business Logic Validation**: Service layer validates business rules

## 📈 **Performance Optimizations**

### **Query Optimization**
- **Indexed Fields**: Queries use indexed columns (id, email)
- **Efficient Joins**: Minimal table joins for complex queries
- **Pagination**: LIMIT/OFFSET for large result sets
- **Selective Fields**: Only fetch required columns

### **Database Connection**
- **Connection Pooling**: TypeORM manages database connections
- **Transaction Support**: ACID compliance for critical operations
- **Query Caching**: Database-level query optimization

## 🔍 **Query Examples by Category**

### **Authentication Queries**
```sql
-- User login validation
SELECT id, email, password, firstName, lastName, isActive, createdAt, updatedAt
FROM users WHERE email = $1

-- User registration
INSERT INTO users (email, password, firstName, lastName, isActive, createdAt, updatedAt)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING id, email, firstName, lastName, isActive, createdAt, updatedAt
```

### **Search & Filter Queries**
```sql
-- Email pattern search (case-insensitive)
SELECT id, email, firstName, lastName, isActive, createdAt, updatedAt
FROM users WHERE email ILIKE $1 ORDER BY createdAt DESC

-- Active users only
SELECT id, email, firstName, lastName, isActive, createdAt, updatedAt
FROM users WHERE isActive = true ORDER BY createdAt DESC
```

### **Pagination Queries**
```sql
-- Paginated user list
SELECT id, email, firstName, lastName, isActive, createdAt, updatedAt
FROM users ORDER BY createdAt DESC LIMIT $1 OFFSET $2

-- Total count for pagination
SELECT COUNT(*) as total FROM users
```

### **Bulk Operation Queries**
```sql
-- Bulk status update
UPDATE users 
SET isActive = $1, updatedAt = NOW() 
WHERE id IN ($2, $3, $4)
RETURNING id
```

## 🧪 **Testing SQL Queries**

### **Unit Testing**
```typescript
describe('AuthService SQL Queries', () => {
  it('should execute user search query', async () => {
    const mockQuery = jest.fn().mockResolvedValue([mockUser]);
    dataSource.query = mockQuery;
    
    await service.searchUsersByEmail('john');
    
    expect(mockQuery).toHaveBeenCalledWith(
      USER_QUERIES.SEARCH_USERS_BY_EMAIL,
      ['%john%']
    );
  });
});
```

### **Integration Testing**
```typescript
describe('Auth API Integration', () => {
  it('should create and retrieve user', async () => {
    // Create user
    const createResponse = await request(app)
      .post('/auth/register')
      .send(validUserData);
    
    expect(createResponse.status).toBe(201);
    
    // Retrieve user
    const userId = createResponse.body.id;
    const getResponse = await request(app)
      .get(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getResponse.status).toBe(200);
  });
});
```

## 🚨 **Common Issues & Solutions**

### **1. Query Parameter Mismatch**
```typescript
// ❌ Error: Parameter count mismatch
await this.dataSource.query(
  'SELECT * FROM users WHERE id = $1 AND email = $2',
  [userId] // Missing email parameter
);

// ✅ Solution: Match parameters correctly
await this.dataSource.query(
  'SELECT * FROM users WHERE id = $1 AND email = $2',
  [userId, userEmail]
);
```

### **2. Dynamic Query Building**
```typescript
// ❌ Error: SQL injection risk
const query = `UPDATE users SET ${field} = '${value}' WHERE id = ${id}`;

// ✅ Solution: Use parameterized queries
const { updateFields, values } = buildUpdateQuery(updateData);
await this.dataSource.query(
  USER_QUERIES.UPDATE_USER(updateFields),
  [...values, id]
);
```

### **3. Transaction Management**
```typescript
// ✅ Use transactions for multiple operations
await this.dataSource.transaction(async manager => {
  await manager.query('DELETE FROM users WHERE id = $1', [userId]);
  await manager.query('DELETE FROM user_sessions WHERE userId = $1', [userId]);
});
```

## 📚 **Best Practices**

### **Query Organization**
1. **Centralize Queries**: Keep all SQL in `sql-queries.ts`
2. **Use Constants**: Reference queries by constant names
3. **Document Queries**: Add comments explaining complex queries
4. **Version Control**: Track query changes in git

### **Performance**
1. **Use Indexes**: Ensure frequently queried columns are indexed
2. **Limit Results**: Always use LIMIT for potentially large result sets
3. **Selective Fields**: Only fetch required columns
4. **Query Analysis**: Use EXPLAIN ANALYZE for slow queries

### **Security**
1. **Parameterized Queries**: Never concatenate user input
2. **Input Validation**: Validate all inputs before querying
3. **Permission Checks**: Verify user permissions before operations
4. **Audit Logging**: Log sensitive operations for security

## 🔄 **Migration from TypeORM Query Builder**

### **Before (TypeORM)**
```typescript
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email LIKE :email', { email: `%${pattern}%` })
  .andWhere('user.isActive = :isActive', { isActive: true })
  .orderBy('user.createdAt', 'DESC')
  .getMany();
```

### **After (Raw SQL)**
```typescript
const users = await this.dataSource.query(
  'SELECT * FROM users WHERE email ILIKE $1 AND "isActive" = $2 ORDER BY "createdAt" DESC',
  [`%${pattern}%`, true]
);
```

## 📖 **Additional Resources**

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **SQL Performance Tuning**: https://use-the-index-luke.com/
- **NestJS Database**: https://docs.nestjs.com/techniques/database
- **TypeORM Raw Queries**: https://typeorm.io/#/raw-queries

---

This SQL-based approach provides better performance, more control, and easier optimization compared to ORM query builders while maintaining security and maintainability.
