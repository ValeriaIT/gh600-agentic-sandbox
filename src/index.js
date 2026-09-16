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

module.exports = {
  calculateTotal,
  getUserData,
};
