import type { Database } from "../../../src/database/connection";
import { PgCourseRepository } from "../../../src/modules/courses/courses.repository";

const normalize = (sql: string) => sql.replace(/\s+/g, " ").trim();
const course = { id: 7, name: "Qualidade" };
const makeDatabase = () => ({ query: jest.fn<Promise<{ rows: unknown[] }>, [string, unknown[]?]>() });

describe("PgCourseRepository", () => {
  let db: ReturnType<typeof makeDatabase>;
  let repository: PgCourseRepository;
  beforeEach(() => { db = makeDatabase(); repository = new PgCourseRepository(db as unknown as Database); });

  test("insere disciplina com parâmetros e retorna a linha", async () => {
    db.query.mockResolvedValue({ rows: [course] });
    expect(await repository.create({ name: "Qualidade" })).toEqual(course);
    expect(db.query).toHaveBeenCalledTimes(1);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/INSERT INTO courses \(name\) VALUES \(\$1\) RETURNING id, name/i);
    expect(values).toEqual(["Qualidade"]);
  });
  test("lista cursos com ordenação por id e sem parâmetros", async () => {
    db.query.mockResolvedValue({ rows: [course] });
    expect(await repository.findAll()).toEqual([course]);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/SELECT id, name FROM courses ORDER BY id/i);
    expect(values).toBeUndefined();
  });
  test("retorna lista vazia", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findAll()).toEqual([]);
  });
  test("busca por id", async () => {
    db.query.mockResolvedValue({ rows: [course] });
    expect(await repository.findOne(7)).toEqual(course);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/SELECT id, name FROM courses WHERE id = \$1/i);
    expect(values).toEqual([7]);
  });
  test("retorna undefined para id inexistente", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findOne(7)).toBeUndefined();
  });
  test.each([
    ["create", async (repo: PgCourseRepository) => repo.create({ name: "Qualidade" })],
    ["findAll", async (repo: PgCourseRepository) => repo.findAll()],
    ["findOne", async (repo: PgCourseRepository) => repo.findOne(7)],
  ])("propaga falha de %s", async (_method, call) => {
    const error = new Error("banco indisponível"); db.query.mockRejectedValue(error);
    await expect(call(repository)).rejects.toBe(error);
  });
});
