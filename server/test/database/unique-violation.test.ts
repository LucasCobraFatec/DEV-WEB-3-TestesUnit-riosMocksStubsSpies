import { isUniqueViolation } from "../../src/database/unique-violation";

test("reconhece SQLSTATE de unicidade", () => expect(isUniqueViolation({ code: "23505" })).toBe(true));
test.each([null, undefined, "23505", 23503, {}, { code: "outro" }])(
  "não reconhece entrada inválida", (value) => expect(isUniqueViolation(value)).toBe(false),
);
