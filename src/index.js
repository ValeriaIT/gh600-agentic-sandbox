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

// 1. Parameterized user lookup
async function getUserUnsafe(database, userId, userRole) {
  if (
    !database ||
    typeof database.query !== "function" ||
    typeof userId !== "string" ||
    userId.trim().length === 0 ||
    typeof userRole !== "string" ||
    userRole.trim().length === 0
  ) {
    throw new TypeError("database, userId, and userRole are required");
  }

  const result = await database.query(
    "SELECT * FROM users WHERE id = $1 AND role = $2",
    [userId, userRole],
  );
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

// 3. Safe arithmetic expression evaluation
function calculateExpression(expressionString) {
  if (typeof expressionString !== "string" || expressionString.trim() === "") {
    throw new TypeError("expressionString must be a non-empty string");
  }

  const tokens = expressionString.match(/\d+(?:\.\d+)?|[()+\-*/]/g);
  if (!tokens || tokens.join("") !== expressionString.replace(/\s+/g, "")) {
    throw new SyntaxError("expression contains unsupported characters");
  }

  let position = 0;
  function parseExpression() {
    let value = parseTerm();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  function parseTerm() {
    let value = parseFactor();
    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position++];
      const right = parseFactor();
      if (operator === "/" && right === 0) {
        throw new RangeError("cannot divide by zero");
      }
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function parseFactor() {
    const token = tokens[position++];
    if (token === "(") {
      const value = parseExpression();
      if (tokens[position++] !== ")") {
        throw new SyntaxError("missing closing parenthesis");
      }
      return value;
    }
    if (!token || Number.isNaN(Number(token))) {
      throw new SyntaxError("invalid arithmetic expression");
    }
    return Number(token);
  }

  const result = parseExpression();
  if (position !== tokens.length || !Number.isFinite(result)) {
    throw new SyntaxError("invalid arithmetic expression");
  }
  return result;
}

module.exports = {
  calculateTotal,
  getUserData,
  fetchUserByIdAndRoleUnsafeSqlInjection,
  getUserUnsafe,
  findUniqueId,
  calculateExpression,
};
