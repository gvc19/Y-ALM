// SQL Queries for User Management
export const USER_QUERIES = {
  // Check if user exists by email
  CHECK_USER_EXISTS: 'SELECT id FROM users WHERE email = $1',
  
  // Insert new user
  INSERT_USER: `
    INSERT INTO users (email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt"
  `,
  
  // Get user by email (with password for validation)
  GET_USER_BY_EMAIL: `
    SELECT id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt"
    FROM users WHERE email = $1
  `,
  
  // Get user by ID (without password)
  GET_USER_BY_ID: `
    SELECT id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt 
    FROM users WHERE id = $1
  `,
  
  // Get all users (without password)
  GET_ALL_USERS: `
    SELECT id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt 
    FROM users ORDER BY "createdAt" DESC
  `,
  
  // Update user
  UPDATE_USER: (fields: string[]) => `
    UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} 
    RETURNING id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt"
  `,
  
  // Delete user
  DELETE_USER: 'DELETE FROM users WHERE id = $1 RETURNING id',
  
  // Deactivate user
  DEACTIVATE_USER: 'UPDATE users SET "isActive" = false, "updatedAt" = NOW() WHERE id = $1 RETURNING id',
  
  // Activate user
  ACTIVATE_USER: 'UPDATE users SET "isActive" = true, "updatedAt" = NOW() WHERE id = $1 RETURNING id',
  
  // Search users by email (partial match)
  SEARCH_USERS_BY_EMAIL: `
    SELECT id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt 
    FROM users WHERE email ILIKE $1 ORDER BY "createdAt" DESC
  `,
  
  // Get users with pagination
  GET_USERS_PAGINATED: `
    SELECT id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt 
    FROM users ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2
  `,
  
  // Count total users
  COUNT_USERS: 'SELECT COUNT(*) as total FROM users',
  
  // Get active users only
  GET_ACTIVE_USERS: `
    SELECT id, email, "firstName", "lastName", "isActive", "createdAt", "updatedAt 
    FROM users WHERE "isActive" = true ORDER BY "createdAt" DESC
  `
};

// Parameter builders for dynamic queries
export const buildUpdateQuery = (updateData: any) => {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.email !== undefined) {
    updateFields.push(`email = $${paramIndex++}`);
    values.push(updateData.email);
  }

  if (updateData.firstName !== undefined) {
    updateFields.push(`"firstName" = $${paramIndex++}`);
    values.push(updateData.firstName);
  }

  if (updateData.lastName !== undefined) {
    updateFields.push(`"lastName" = $${paramIndex++}`);
    values.push(updateData.lastName);
  }

  if (updateData.password !== undefined) {
    updateFields.push(`password = $${paramIndex++}`);
    values.push(updateData.password);
  }

  // Add updatedAt timestamp
  updateFields.push(`"updatedAt" = NOW()`);

  return { updateFields, values };
};
