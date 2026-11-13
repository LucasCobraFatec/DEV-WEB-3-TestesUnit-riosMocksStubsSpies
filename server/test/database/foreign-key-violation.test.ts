import { isForeignKeyViolation } from "../../src/database/foreign-key-violation";

test("reconhece SQLSTATE de chave estrangeira", () => expect(isForeignKeyViolation({ code: "23503" })).toBe(true));
test.each([null, undefined, "23505", 23503, {}, { code: "outro" }])(
  "não reconhece entrada inválida", (value) => expect(isForeignKeyViolation(value)).toBe(false),
);
