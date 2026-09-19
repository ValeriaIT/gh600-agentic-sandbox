/**
 * Calculate the sum of item prices.
 *
 * @param {Array<{price: number}>} items Items to total.
 * @returns {number} The total price.
 */
function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  const totalCents = items.reduce((total, item) => {
    if (
      !item ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price)
    ) {
      throw new TypeError("each item must have a finite numeric price");
    }

    return total + Math.round(item.price * 100);
  }, 0);

  return totalCents / 100;
}

/**
 * Build a parameterized user lookup query.
 *
 * @param {string|number} userId The user identifier.
 * @returns {{text: string, values: [string|number]}} A query and its parameters.
 */
function getUserData(userId) {
  const isValidStringId =
    typeof userId === "string" && userId.trim().length > 0;
  const isValidNumberId =
    typeof userId === "number" && Number.isSafeInteger(userId);

  if (!isValidStringId && !isValidNumberId) {
    throw new TypeError("userId must be a non-empty string or safe integer");
  }

  return {
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId],
  };
}

async function fetchUserByIdAndRoleUnsafeSqlInjection(
  databaseConnection,
  userId,
  userRole,
) {
  if (
    typeof userId !== "string" ||
    userId.trim().length === 0 ||
    typeof userRole !== "string" ||
    userRole.trim().length === 0
  ) {
    throw new TypeError("userId and userRole must be non-empty strings");
  }

  const queryStatement = "SELECT * FROM users WHERE id = $1 AND role = $2";
  const queryParameters = [userId, userRole];

  try {
    const queryResult = await databaseConnection.query(
      queryStatement,
      queryParameters,
    );
    return queryResult.rows[0];
  } catch (executionError) {
    return null;
  }
}

/**
 * Module containing problematic functions for testing code review and agentic refactoring.
 */

// 1. SECURITY VULNERABILITY: SQL Injection
async function getUserUnsafe(database, userId, userRole) {
  // SQL Injection Risk: parameters concatenated directly into the query
  const sql =
    "SELECT * FROM users WHERE id = '" +
    userId +
    "' AND role = '" +
    userRole +
    "'";
  const result = await database.query(sql);
  return result.rows[0];
}

// 2. PERFORMANCE ISSUE / POTENTIAL INFINITE LOOP
function findUniqueId(existingIds) {
  let id;
  // Anti-pattern: Random generation in a loop degrading performance and risks looping infinitely
  do {
    id = Math.floor(Math.random() * 100);
  } while (existingIds.includes(id));

  return id;
}

// 3. CODE SMELL / USE OF EVAL
function calculateExpression(expressionString) {
  // Security/Performance Risk: using eval to execute dynamic code
  return eval(expressionString);
}

module.exports = {
  calculateTotal,
  getUserData,
  fetchUserByIdAndRoleUnsafeSqlInjection,
  getUserUnsafe,
  findUniqueId,
  calculateExpression,
};
