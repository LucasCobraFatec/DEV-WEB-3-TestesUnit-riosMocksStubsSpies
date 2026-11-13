import { HttpError } from "../src/errors";
import { parseId, positiveInteger, validateBody, validateName } from "../src/validation";

describe("positiveInteger", () => {
  test.each([1, 2147483647])("aceita %s", (value) => {
    expect(positiveInteger(value, "RA")).toBe(value);
  });
  test.each([0, -1, 1.5, NaN, Infinity, 2147483648, "123", null, undefined])(
    "rejeita %s com erro 400", (value) => {
      try { positiveInteger(value, "RA"); fail("deveria rejeitar"); }
      catch (error) { expect(error).toBeInstanceOf(HttpError); expect(error).toMatchObject({ statusCode: 400 }); }
    },
  );
});

describe("parseId", () => {
  test.each([["1", 1], ["2147483647", 2147483647]])("converte %s", (value, expected) => {
    expect(parseId(value, "RA")).toBe(expected);
  });
  test.each(["1abc", "1.2", "1e2", "", "-1", "0", "2147483648", 123])(
    "rejeita %s com erro 400", (value) => {
      try { parseId(value, "RA"); fail("deveria rejeitar"); }
      catch (error) { expect(error).toBeInstanceOf(HttpError); expect(error).toMatchObject({ statusCode: 400 }); }
    },
  );
});

describe("validateName", () => {
  test.each(["Ana", "a".repeat(100)])("aceita nome válido", (value) => expect(validateName(value)).toBe(value));
  test.each(["", "ab", "   ", " a ", "a".repeat(101), 123, null, undefined])(
    "rejeita nome inválido com erro 400", (value) => {
      try { validateName(value); fail("deveria rejeitar"); }
      catch (error) { expect(error).toBeInstanceOf(HttpError); expect(error).toMatchObject({ statusCode: 400 }); }
    },
  );
});

describe("validateBody", () => {
  test("aceita objeto congelado sem modificar sua referência", () => {
    const body = Object.freeze({ name: "Ana" });
    expect(validateBody(body)).toBe(body);
    expect(body.name).toBe("Ana");
  });
  test.each([null, undefined, [], "Ana", 12])("rejeita corpo inválido com erro 400", (value) => {
    try { validateBody(value); fail("deveria rejeitar"); }
    catch (error) { expect(error).toBeInstanceOf(HttpError); expect(error).toMatchObject({ statusCode: 400 }); }
  });
  test("aceita campos extras sem alterar o objeto", () => {
    const body = { name: "Ana", extra: true };
    expect(validateBody(body)).toBe(body);
    expect(body).toEqual({ name: "Ana", extra: true });
  });
});
