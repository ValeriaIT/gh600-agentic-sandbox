const { calculateTotal, getUserData } = require("../src/index.js");

describe("calculateTotal", () => {
  test("calculates the total for multiple items", () => {
    expect(
      calculateTotal([{ price: 1.23 }, { price: 2.5 }, { price: 0.27 }]),
    ).toBe(4);
  });

  test("returns zero for an empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  test("avoids floating-point precision errors", () => {
    expect(calculateTotal([{ price: 0.1 }, { price: 0.2 }])).toBe(0.3);
  });

  test("rounds prices to the nearest cent", () => {
    expect(calculateTotal([{ price: 1.004 }])).toBe(1);
    expect(calculateTotal([{ price: 1.006 }])).toBe(1.01);
  });

  test("supports negative prices", () => {
    expect(calculateTotal([{ price: 10 }, { price: -2.5 }])).toBe(7.5);
  });

  test.each([null, undefined, {}, "items", 42, true])(
    "throws when items is not an array: %p",
    (items) => {
      expect(() => calculateTotal(items)).toThrow(
        new TypeError("items must be an array"),
      );
    },
  );

  test.each([
    null,
    undefined,
    {},
    { price: "10" },
    { price: NaN },
    { price: Infinity },
    { price: -Infinity },
  ])("throws when an item has an invalid price: %p", (item) => {
    expect(() => calculateTotal([item])).toThrow(
      new TypeError("each item must have a finite numeric price"),
    );
  });
});

describe("getUserData", () => {
  test("builds a parameterized query for a string ID", () => {
    expect(getUserData("123")).toEqual({
      text: "SELECT * FROM users WHERE id = $1",
      values: ["123"],
    });
  });

  test("builds a parameterized query for a safe integer ID", () => {
    expect(getUserData(42)).toEqual({
      text: "SELECT * FROM users WHERE id = $1",
      values: [42],
    });
  });

  test("keeps the ID out of the SQL text", () => {
    const maliciousId = "42 OR 1=1";
    const query = getUserData(maliciousId);

    expect(query.text).not.toContain(maliciousId);
    expect(query.values).toEqual([maliciousId]);
  });

  test.each([
    null,
    undefined,
    "",
    "   ",
    {},
    [],
    true,
    false,
    NaN,
    Infinity,
    -Infinity,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
  ])("throws for an invalid ID: %p", (userId) => {
    expect(() => getUserData(userId)).toThrow(
      new TypeError("userId must be a non-empty string or safe integer"),
    );
  });
});
