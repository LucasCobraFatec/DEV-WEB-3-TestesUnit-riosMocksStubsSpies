import type { Database } from "../../../src/database/connection";
import { PgStudentRepository } from "../../../src/modules/students/students.repository";

const normalize = (sql: string) => sql.replace(/\s+/g, " ").trim();
const student = { ra: 123, name: "Ana" };
const makeDatabase = () => ({ query: jest.fn<Promise<{ rows: unknown[] }>, [string, unknown[]?]>() });

describe("PgStudentRepository", () => {
  let db: ReturnType<typeof makeDatabase>;
  let repository: PgStudentRepository;
  beforeEach(() => { db = makeDatabase(); repository = new PgStudentRepository(db as unknown as Database); });

  test("insere aluno com parâmetros e retorna a linha", async () => {
    db.query.mockResolvedValue({ rows: [student] });
    expect(await repository.create(student)).toEqual(student);
    expect(db.query).toHaveBeenCalledTimes(1);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/INSERT INTO students \(ra, name\) VALUES \(\$1, \$2\) RETURNING ra, name/i);
    expect(values).toEqual([123, "Ana"]);
  });
  test("lista alunos em ordem de nome e sem parâmetros", async () => {
    db.query.mockResolvedValue({ rows: [student] });
    expect(await repository.findAll()).toEqual([student]);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/SELECT ra, name FROM students ORDER BY name/i);
    expect(values).toBeUndefined();
  });
  test("retorna lista vazia", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findAll()).toEqual([]);
  });
  test("busca por RA", async () => {
    db.query.mockResolvedValue({ rows: [student] });
    expect(await repository.findOne(123)).toEqual(student);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toMatch(/SELECT ra, name FROM students WHERE ra = \$1/i);
    expect(values).toEqual([123]);
  });
  test("retorna undefined para RA inexistente", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findOne(123)).toBeUndefined();
  });
  test.each([
    ["create", async (repo: PgStudentRepository) => repo.create(student)],
    ["findAll", async (repo: PgStudentRepository) => repo.findAll()],
    ["findOne", async (repo: PgStudentRepository) => repo.findOne(123)],
  ])("propaga falha de %s", async (_method, call) => {
    const error = new Error("banco indisponível"); db.query.mockRejectedValue(error);
    await expect(call(repository)).rejects.toBe(error);
  });
});
