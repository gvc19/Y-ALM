// SQL Queries for User Management
export const USER_QUERIES = {
  // Check if user exists by email
  CHECK_USER_EXISTS: 'SELECT "Id" FROM users WHERE "Email" = $1',
  
  // Insert new user
  INSERT_USER: `
    INSERT INTO users (username, "Email", "Hashed_Password", "First_Name", "Last_Name", "dob", "Is_Active", "Created_at", "Updated_at")
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
  `,
  
  // Get user by email (with password for validation)
  GET_USER_BY_EMAIL: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", "Hashed_Password", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users WHERE "Email" = $1
  `,
  
  // Get user by ID (without password)
  GET_USER_BY_ID: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users WHERE "Id" = $1
  `,
  
  // Get all users (without password)
  GET_ALL_USERS: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users ORDER BY "Created_at" DESC
  `,
  
  // Update user
  UPDATE_USER: (fields: string[]) => `
    UPDATE users SET ${fields.join(', ')} WHERE "Id" = $${fields.length + 1} 
    RETURNING "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
  `,
  
  // Delete user
  DELETE_USER: 'DELETE FROM users WHERE "Id" = $1 RETURNING "Id"',
  
  // Deactivate user
  DEACTIVATE_USER: 'UPDATE users SET "Is_Active" = false, "Updated_at" = NOW() WHERE "Id" = $1 RETURNING "Id"',
  
  // Activate user
  ACTIVATE_USER: 'UPDATE users SET "Is_Active" = true, "Updated_at" = NOW() WHERE "Id" = $1 RETURNING "Id"',
  
  // Search users by email (partial match)
  SEARCH_USERS_BY_EMAIL: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users WHERE "Email" ILIKE $1 ORDER BY "Created_at" DESC
  `,
  
  // Get users with pagination
  GET_USERS_PAGINATED: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users ORDER BY "Created_at" DESC LIMIT $1 OFFSET $2
  `,
  
  // Count total users
  COUNT_USERS: 'SELECT COUNT(*) as total FROM users',
  
  // Get active users only
  GET_ACTIVE_USERS: `
    SELECT "Id", username, "First_Name", "Last_Name", "Email", dob, "Is_Active", "Is_deleted", "Created_at", "Created_by", "Updated_at", "Updated_by"
    FROM users WHERE "Is_Active" = true ORDER BY "Created_at" DESC
  `
};

// Parameter builders for dynamic queries
export const buildUpdateQuery = (updateData: any) => {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.username !== undefined) {
    updateFields.push(`username = $${paramIndex++}`);
    values.push(updateData.username);
  }
  if (updateData.First_Name !== undefined) {
    updateFields.push(`"First_Name" = $${paramIndex++}`);
    values.push(updateData.First_Name);
  }
  if (updateData.Last_Name !== undefined) {
    updateFields.push(`"Last_Name" = $${paramIndex++}`);
    values.push(updateData.Last_Name);
  }
  if (updateData.Email !== undefined) {
    updateFields.push(`"Email" = $${paramIndex++}`);
    values.push(updateData.Email);
  }
  if (updateData.password !== undefined) {
    updateFields.push(`"Hashed_Password" = $${paramIndex++}`);
    values.push(updateData.password);
  }
  if (updateData.dob !== undefined) {
    updateFields.push(`dob = $${paramIndex++}`);
    values.push(updateData.dob);
  }
  if (updateData.Is_Active !== undefined) {
    updateFields.push(`"Is_Active" = $${paramIndex++}`);
    values.push(updateData.Is_Active);
  }
  if (updateData.Is_deleted !== undefined) {
    updateFields.push(`"Is_deleted" = $${paramIndex++}`);
    values.push(updateData.Is_deleted);
  }
  if (updateData.Updated_by !== undefined) {
    updateFields.push(`"Updated_by" = $${paramIndex++}`);
    values.push(updateData.Updated_by);
  }

  // Add Updated_at timestamp
  updateFields.push(`"Updated_at" = NOW()`);

  return { updateFields, values };
};
